import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { AppService } from '../services/app.service';

interface MenuItem {
  custPrice: any;
  icon: any;
  itemName: string;
  itemDescription?: string;
  itemPrice: string;
  quantity: number;
  customization: any;
}

interface MenuCategory {
  categoryName: string;
  routeName?: string;
  searchTerm?: string;
  categoryDescription?: string;
  items: MenuItem[];
}

interface CartItem {
  itemName: string;
  itemPrice: string;
  itemQuantity: number;
  itemIcon: string;
  customization?: string;
  isCustomized?: boolean;
}

interface CustomizationOption {
  name: string;
  price: number;
}

interface CustomizationGroup {
  custName: string;
  custDescription: string;
  required: string;
  cust: CustomizationOption[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  // Component state
  cart: CartItem[] = [];
  selectedCategory: number = 0;
  currentModalItem: any = null;
  selectedCustomizations: {
    [groupIndex: number]: {
      type: 'single' | 'multi';
      selections: { optionIndex: number; option: CustomizationOption }[];
    }
  } = {};
  showModal: boolean = false;
  itemQuantities: { [key: string]: number } = {};
  modalQuantity: number = 1;

  // Logo
  logo: string = "https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/18efe2f4-d3d3-4f46-8772-d36bc989688c_addLogo.png";

  // Menu item images mapping - loaded from JSON
  menuImages: { [key: string]: string } = {};

  // Menu data - loaded from JSON
  categories2: MenuCategory[] = [];
  isMultiGroup(group: CustomizationGroup): boolean {
    return group.required !== 'true';
  }

  constructor(
    private seoService: SeoService,
    private appService: AppService

  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.updateCartCount();
    this.seoService.updateSeoTags('menu');
    this.loadData();
    this.populateAllCategory();
  }


  // Checkbox: is this option currently selected in a multi group?
  isOptionSelected(groupIndex: number, optionIndex: number): boolean {
    const bucket = this.selectedCustomizations[groupIndex];
    if (!bucket || !bucket.selections) return false;
    return bucket.selections.some(s => s.optionIndex === optionIndex);
  }

  // Radio: is this option the selected one in a single group?
  isRadioSelected(groupIndex: number, optionIndex: number): boolean {
    const bucket = this.selectedCustomizations[groupIndex];
    if (!bucket || !bucket.selections || bucket.selections.length === 0) return false;
    return bucket.selections[0].optionIndex === optionIndex;
  }

  private loadData(): void {
    // Load menu data from JSON - note the capital 'M' in 'Menu'
    this.categories2 = this.appService.getContentData('Menu') || [];

    // Load menu images from JSON
    const menuImagesData = this.appService.getContentData('menuImages') || [];
    this.menuImages = {};

    // Convert menuImages array to object mapping
    menuImagesData.forEach((imageItem: any) => {
      if (imageItem.imageName && imageItem.icon) {
        // Remove file extension from imageName for matching
        const itemName = imageItem.imageName.replace(/\.(png|jpg|jpeg)$/i, '');
        this.menuImages[itemName] = imageItem.icon;
      }
    });

    // If no data is loaded, initialize with empty array
    if (!this.categories2 || this.categories2.length === 0) {
      this.categories2 = [];
    }
  }

  // Populate "All" category with items from all other categories
  populateAllCategory(): void {
    if (!this.categories2 || this.categories2.length === 0) {
      return;
    }

    const allItems: MenuItem[] = [];
    this.categories2.forEach(category => {
      if (category.categoryName !== 'All' && category.items) {
        allItems.push(...category.items);
      }
    });

    // Find the "All" category and populate it
    const allCategory = this.categories2.find(cat => cat.categoryName === 'All');
    if (allCategory) {
      allCategory.items = allItems;
    }
  }

  // Get item image
  getItemImage(itemName: string): string {
    return this.menuImages[itemName] || this.logo;
  }

  // Load cart from localStorage
  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  // Save cart to localStorage
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Update cart count
  updateCartCount(): void {
    // Count unique items, not total quantity
    const uniqueItemCount = this.cart.length;
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { count: uniqueItemCount }
    }));
  }

  // Select category
  selectCategory(index: number, categoryName: string): void {
    this.selectedCategory = index;
  }

  // Update quantity
  updateQuantity(itemName: string, change: number): void {
    if (!this.itemQuantities[itemName]) {
      this.itemQuantities[itemName] = 0;
    }
    this.itemQuantities[itemName] = Math.max(0, this.itemQuantities[itemName] + change);
  }

  // Get quantity for item
  getQuantity(itemName: string): number {
    return this.itemQuantities[itemName] || 0;
  }

  // Check if add to cart button should be disabled
  isAddToCartDisabled(itemName: string): boolean {
    return this.getQuantity(itemName) === 0;
  }

  // Add to cart
  addToCart(item: MenuItem): void {
    const quantity = this.getQuantity(item.itemName);
    if (quantity > 0) {
      const newItem: CartItem = {
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        itemQuantity: quantity,
        itemIcon: this.getItemImage(item.itemName)
      };

      // Check if item already exists in cart
      const existingItemIndex = this.cart.findIndex(cartItem => cartItem.itemName === newItem.itemName);

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        this.cart[existingItemIndex].itemQuantity += quantity;
      } else {
        // New item, add to cart
        this.cart.push(newItem);
      }

      this.saveCart();
      this.updateCartCount();

      // Reset quantity
      this.itemQuantities[item.itemName] = 0;
    }
  }

  // Open customization modal
  openCustomizationModal(item: MenuItem): void {
    if (!item.customization || !Array.isArray(item.customization)) return;

    this.currentModalItem = item;
    this.selectedCustomizations = {};

    item.customization.forEach((g: CustomizationGroup, idx: number) => {
      this.selectedCustomizations[idx] = {
        type: this.isMultiGroup(g) ? 'multi' : 'single',
        selections: []
      };
    });

    this.modalQuantity = 1;
    this.showModal = true;
  }


  // Close customization modal
  closeCustomizationModal(): void {
    this.showModal = false;
    this.currentModalItem = null;
    this.selectedCustomizations = {};
    this.modalQuantity = 1;
  }

  // Update customization selection
  updateCustomizationSelection(
    groupIndex: number,
    optionIndex: number,
    option: CustomizationOption,
    isMulti: boolean
  ): void {
    const bucket = this.selectedCustomizations[groupIndex];
    if (!bucket) return;

    if (isMulti) {
      // toggle checkbox
      const i = bucket.selections.findIndex(s => s.optionIndex === optionIndex);
      if (i >= 0) bucket.selections.splice(i, 1);
      else bucket.selections.push({ optionIndex, option });
    } else {
      // single choice (radio)
      bucket.selections = [{ optionIndex, option }];
    }
  }

  // Update modal quantity
  updateModalQuantity(change: number): void {
    this.modalQuantity = Math.max(1, this.modalQuantity + change);
  }

  // Get modal quantity
  getModalQuantity(): number {
    return this.modalQuantity;
  }

  // Get modal total price
  getModalTotalPrice(): number {
    if (!this.currentModalItem) return 0;
    const base = parseFloat(this.currentModalItem.itemPrice || '0') || 0;
    let unit = base;
    Object.values(this.selectedCustomizations).forEach((bucket: any) => {
      bucket.selections.forEach((sel: any) => unit += sel.option.price);
    });
    return unit * this.modalQuantity;
  }


  // Add customized item to cart
  addCustomizedItemToCart(notes: string = ''): void {
    if (!this.currentModalItem) return;

    // every required group must have at least one selection
    for (let gi = 0; gi < this.currentModalItem.customization.length; gi++) {
      const group = this.currentModalItem.customization[gi];
      if (group.required === 'true') {
        const bucket = this.selectedCustomizations[gi];
        if (!bucket || bucket.selections.length === 0) return;
      }
    }

    const totalPrice = this.getModalTotalPrice();

    let customizationText = '';
    Object.entries(this.selectedCustomizations).forEach(([gi, bucket]: any) => {
      const groupName = this.currentModalItem.customization[+gi].custName;
      const names = bucket.selections.map((s: any) => s.option.name).join(', ');
      if (names) customizationText += `${groupName}: ${names}; `;
    });
    if (notes) customizationText += `Notes: ${notes}`;

    const cartItem: CartItem = {
      itemName: this.currentModalItem.itemName,
      itemPrice: (totalPrice / this.modalQuantity).toFixed(2), // unit price
      itemQuantity: this.modalQuantity,
      itemIcon: this.getItemImage(this.currentModalItem.itemName),
      customization: customizationText.trim(),
      isCustomized: true
    };

    this.cart.push(cartItem);
    this.saveCart();
    this.updateCartCount();
    this.closeCustomizationModal();
  }

  // Navigate to cart
  goToCart(): void {
    window.location.href = '/cart';
  }
}

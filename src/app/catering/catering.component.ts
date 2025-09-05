import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { AppService } from '../services/app.service';

interface CateringItem {
  itemName: string;
  itemDescription?: string;
  itemPrice: string;
  quantity: number;
  customization: any;
}

interface CateringCategory {
  categoryName: string;
  routeName: string;
  searchTerm?: string;
  categoryDescription?: string;
  items: CateringItem[];
}

interface CartItem {
  itemName: string;
  itemPrice: string;
  itemQuantity: number;
  itemIcon: string;
  customization?: string;
  isCustomized?: boolean;
}

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.scss']
})
export class CateringComponent implements OnInit {

  // Component state
  cart: CartItem[] = [];
  selectedCategory: number = 0;
  itemQuantities: { [key: string]: number } = {};

  // Logo
  logo: string = "https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/18efe2f4-d3d3-4f46-8772-d36bc989688c_addLogo.png";

  // Menu item images mapping - loaded from JSON
  menuImages: { [key: string]: string } = {};

  // Catering menu data
  categories2: CateringCategory[] = [];

  constructor(
    private seoService: SeoService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.updateCartCount();
    this.seoService.updateSeoTags('catering');
    this.loadData();
    this.populateAllCategory();
  }

  private loadData(): void {
    // Load all required data from AppService
    this.categories2 = this.appService.getContentData('cateringMenu') || [];
    
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
    
    const allItems: CateringItem[] = [];
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
  addToCart(item: CateringItem): void {
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

  // Navigate to cart
  goToCart(): void {
    window.location.href = '/cart';
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';
interface MenuImage {
  imageName: string;
  icon: string;
}

interface CartItem {
  categoryName?: string;
  itemName: string;
  itemIcon: string;
  itemPrice: string;
  itemQuantity: number;
  customization?: string;
}

@Component({
  selector: 'app-menu-two',
  templateUrl: './menu-two.component.html',
  styleUrls: ['./menu-two.component.scss']
})
export class MenuTwoComponent implements OnInit {
  cart: CartItem[] = [];
  categories: any[] = [];
  selectedCategory: any = 'all';
  product: any = null;
  css: any = {};
  logo: string = '';
  public categories2: any;
  display: any = {};
  totalPrice: number = 0;
  realPrice: number | null = null;

  menuImages: MenuImage[] = [];
  menuItemImage: string = '';

  private modifierSelectionsPrices: { [key: string]: number } = {};
  private selectedOptionsMap: { [key: string]: string[] } = {};

  constructor(
    private router: Router,
    private seoService: SeoService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.seoService.updateSeoTags('menu');
    this.css = this.appService.getContentData('css') || {};
    this.categories2 = this.appService.getContentData('menu')[0].menu2 ? this.appService.getContentData('menu')[0].menu2[0].superCategory[0].category : [];
    this.logo = this.appService.getContentData('logo') || 'assets/images/logo.png';
    this.menuImages = this.appService.getContentData('menuImages') || [];
    this.loadMenuCategories();
    this.loadCart();
  }

  private loadMenuCategories(): void {
    const menuData = this.appService.getContentData('menu');
    const rawCategories = menuData?.[0]?.menu?.[0]?.superCategory?.[0]?.category || [];

    this.categories = rawCategories.map((category: any) => ({
      ...category,
      items: (category.items || []).map((item: any) => ({
        ...item,
        quantity: item.quantity ?? 1
      }))
    }));

    this.selectedCategory = this.categories.some((cat: any) => cat.categoryName === 'All') ? 'all' : 0;
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { count: this.cart.length }
    }));
  }

  cartPage(): void {
    this.router.navigate(['/cart']);
  }

  getDiv(index: number, item: any): void {
    this.selectedCategory = item.categoryName === 'All' ? 'all' : index;
    this.product = item.categoryName === 'All' ? null : item;
  }

  findMenuItem(itemName: string): boolean {
    if (!itemName) return false;
    const imageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    const lowerName = itemName.toLowerCase();

    const matched = this.menuImages.find(obj =>
      imageFormats.some(format =>
        obj.imageName?.toLowerCase().endsWith(format) &&
        obj.imageName.toLowerCase().replace(format, '') === lowerName
      )
    );

    if (matched) {
      this.menuItemImage = matched.icon;
      return true;
    }

    this.menuItemImage = '';
    return false;
  }

  addQuantity(item: any): void {
    item.quantity = (item.quantity || 0) + 1;
  }

  subQuantity(item: any): void {
    item.quantity = item.quantity < 1 ? 0 : item.quantity - 1;
  }

  addToCart(item: any, category?: any): void {
    if (!item || item.quantity <= 0) return;

    const payload: CartItem = {
      categoryName: category?.categoryName || this.product?.categoryName || '',
      itemName: item.itemName,
      itemIcon: this.findMenuItem(item.itemName) ? this.menuItemImage : item.icon || this.logo,
      itemPrice: item.itemPrice,
      itemQuantity: item.quantity
    };

    this.cart.push(payload);
    this.saveCart();
  }

  addItemBombayGrill(item: any): void {
    item.quantity = 1;
    this.display = { ...item, customMessage: '' };
    this.totalPrice = this.getBasePrice(item);
    this.realPrice = null;
    this.modifierSelectionsPrices = {};
    this.selectedOptionsMap = {};
  }

  setModifier(subCustomization: any, customization: any, baseItem: any): void {
    this.modifierSelectionsPrices[customization.custName] = subCustomization.price || 0;
    this.selectedOptionsMap[customization.custName] = [subCustomization.name];
    this.recalculateTotal(baseItem);
  }

  addcustom2(event: any, customization: any, subCustomization: any): void {
    const checked = event?.target?.checked;
    const key = customization.custName;
    const name = subCustomization.name;
    const price = subCustomization.price || 0;

    if (checked) {
      this.modifierSelectionsPrices[`${key}-${name}`] = price;
      const current = this.selectedOptionsMap[key] || [];
      this.selectedOptionsMap[key] = [...current.filter((n: string) => n !== name), name];
    } else {
      delete this.modifierSelectionsPrices[`${key}-${name}`];
      this.selectedOptionsMap[key] = (this.selectedOptionsMap[key] || []).filter((n: string) => n !== name);
      if (!this.selectedOptionsMap[key].length) {
        delete this.selectedOptionsMap[key];
      }
    }

    this.recalculateTotal(this.display);
  }

  setSize(event: any, full: any, subCustomization: any, customization: any): void {
    const key = `${customization.custName}-${subCustomization.name}`;
    const price = full?.price ?? full?.fullPrice ?? subCustomization?.fullPrice ?? 0;
    this.modifierSelectionsPrices[key] = price;
    this.selectedOptionsMap[customization.custName] = [`${subCustomization.name}: ${full?.name || ''}`.trim()];
    this.recalculateTotal(this.display);
  }

  addToCartBombayGrill(display: any, category?: any): void {
    if (!display || display.quantity <= 0) return;

    const basePrice = this.getBasePrice(display);
    const finalPrice = this.totalPrice || basePrice;

    const summaryParts: string[] = [];
    Object.entries(this.selectedOptionsMap).forEach(([group, names]) => {
      if (names.length) summaryParts.push(`${group}: ${names.join(', ')}`);
    });
    if (display.customMessage) summaryParts.push(`Notes: ${display.customMessage}`);

    const payload: CartItem = {
      categoryName: category?.categoryName || this.product?.categoryName || '',
      itemName: display.itemName,
      itemIcon: this.findMenuItem(display.itemName) ? this.menuItemImage : display.icon || this.logo,
      itemPrice: finalPrice.toFixed(2),
      itemQuantity: display.quantity,
      customization: summaryParts.join(' | ')
    };

    this.cart.push(payload);
    this.saveCart();
    this.open();
  }

  open(): void {
    this.display = {};
    this.totalPrice = 0;
    this.realPrice = null;
    this.modifierSelectionsPrices = {};
    this.selectedOptionsMap = {};
  }

  private recalculateTotal(baseItem: any): void {
    const basePrice = this.getBasePrice(baseItem);
    const extras = Object.values(this.modifierSelectionsPrices)
      .map(val => parseFloat(String(val)) || 0)
      .reduce((sum, value) => sum + value, 0);

    this.totalPrice = basePrice + extras;
  }

  private getBasePrice(item: any): number {
    return parseFloat(item?.custPrice || item?.itemPrice || '0') || 0;
  }
}

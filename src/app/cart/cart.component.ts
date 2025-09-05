import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';

interface CartItem {
  itemName: string;
  itemPrice: string;
  itemQuantity: number;
  itemIcon: string;
  customization?: string;
  isCustomized?: boolean;
}

interface GroupedCartItem {
  itemName: string;
  itemPrice: string;
  itemQuantity: number;
  itemIcon: string;
  customization?: string;
  isCustomized?: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart: CartItem[] = [];
  groupedItems: GroupedCartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  
  // Tax rate (5% for this example)
  readonly TAX_RATE = 0.05;

  constructor(private router: Router, private seoService: SeoService) { }

  ngOnInit(): void {
    this.loadCart();
    this.updateCartDisplay();
    this.seoService.updateSeoTags('cart');
    
    // Listen for storage changes from other tabs/pages
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.cart = JSON.parse(e.newValue || '[]');
        this.updateCartDisplay();
      }
    });

    // Listen for cart updates from other pages
    window.addEventListener('cartUpdated', () => {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.updateCartDisplay();
    });
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

  // Update cart display and calculations
  updateCartDisplay(): void {
    if (this.cart.length === 0) {
      this.groupedItems = [];
      this.subtotal = 0;
      this.tax = 0;
      this.total = 0;
      return;
    }

    // Group items by name and sum quantities
    const grouped = this.cart.reduce((acc: any, item: CartItem) => {
      const key = item.itemName;
      if (acc[key]) {
        acc[key].itemQuantity += item.itemQuantity;
      } else {
        acc[key] = { ...item };
      }
      return acc;
    }, {});

    this.groupedItems = Object.values(grouped);
    this.calculateTotals();
  }

  // Calculate subtotal, tax, and total
  calculateTotals(): void {
    this.subtotal = this.groupedItems.reduce((sum, item) => {
      return sum + (parseFloat(item.itemPrice) * item.itemQuantity);
    }, 0);
    
    this.tax = this.subtotal * this.TAX_RATE;
    this.total = this.subtotal + this.tax;
  }

  // Update item quantity
  updateItemQuantity(itemName: string, change: number): void {
    const itemIndex = this.cart.findIndex(item => item.itemName === itemName);
    if (itemIndex !== -1) {
      this.cart[itemIndex].itemQuantity += change;
      if (this.cart[itemIndex].itemQuantity <= 0) {
        this.cart.splice(itemIndex, 1);
      }
      this.saveCart();
      this.updateCartDisplay();
      this.updateCartCount();
    }
  }

  // Remove item from cart
  removeItem(itemName: string): void {
    this.cart = this.cart.filter(item => item.itemName !== itemName);
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
  }

  // Update cart count in header
  updateCartCount(): void {
    // Count unique items, not total quantity
    const uniqueItemCount = this.cart.length;
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { count: uniqueItemCount }
    }));
  }

  // Get item total price
  getItemTotal(item: GroupedCartItem): number {
    return parseFloat(item.itemPrice) * item.itemQuantity;
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    return this.cart.length === 0;
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  // Navigate to menu
  goToMenu(): void {
    this.router.navigate(['/menu']);
  }
}

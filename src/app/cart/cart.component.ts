import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';

interface CartItem {
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemIcon?: string;
  customization?: string | any[];
  // legacy support for quantity field used in template when customization exists
  quantity?: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  totalPrice = 0;

  constructor(private appService: AppService, private router: Router) {
    // Load CSS if needed elsewhere
    this.appService.getContentData('css');
  }

  ngOnInit(): void {
    this.cart = this.safeParseCart(localStorage.getItem('cart'));
    this.syncQuantities();
    this.generateTotalPrice();
  }

  addQuantity(index: number): void {
    this.cart[index].itemQuantity += 1;
    this.cart[index].quantity = this.cart[index].itemQuantity;
    this.generateTotalPrice();
  }

  subQuantity(item: CartItem, index: number): void {
    if (item.itemQuantity > 1) {
      this.cart[index].itemQuantity -= 1;
      this.cart[index].quantity = this.cart[index].itemQuantity;
      this.generateTotalPrice();
    }
  }

  addVinoQuantity(index: number): void {
    this.addQuantity(index);
  }

  subVinoQuantity(item: CartItem, index: number): void {
    this.subQuantity(item, index);
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.generateTotalPrice();
  }

  generateTotalPrice(): void {
    this.totalPrice = this.cart.reduce((sum, item) => {
      const price = this.toNumber(item.itemPrice);
      const qty = this.toNumber(item.itemQuantity, 1);
      return sum + price * qty;
    }, 0);

    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    this.persistCart();
  }

  checkoutPage(): void {
    this.router.navigate(['/checkout']);
  }

  private syncQuantities(): void {
    this.cart = this.cart.map((item) => {
      const qty = this.toNumber(item.itemQuantity ?? item.quantity, 1);
      return {
        ...item,
        itemPrice: this.toNumber(item.itemPrice),
        itemQuantity: qty,
        quantity: qty
      };
    });
  }

  private safeParseCart(raw: string | null): CartItem[] {
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
  }

  private toNumber(value: any, fallback: number = 0): number {
    const num = parseFloat(value);
    return Number.isNaN(num) ? fallback : num;
  }
}

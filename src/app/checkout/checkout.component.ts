import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

interface CartItem {
  itemName: string;
  itemPrice: number | string;
  itemQuantity: number;
  customization?: string;
  itemIcon?: string;
  isCustomized?: boolean;
}

interface FormattedCartItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
  customization?: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  errorMessage: string = '';

  // Form data
  formData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  };

  // Cart data
  cartItems: FormattedCartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  isSubmitting: boolean = false;

  constructor(private router: Router, private appService: AppService, private seoService: SeoService) { }

  ngOnInit(): void {
    this.populateCartData();
    this.seoService.updateSeoTags('checkout');
  }

  populateCartData(): void {
    // Get cart data from localStorage
    const cartData = localStorage.getItem('cart');
    console.log('Raw cart data:', cartData);

    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    console.log('Parsed cart:', cart);

    // Calculate subtotal and format cart items
    let subtotal = 0;
    const formattedCart: FormattedCartItem[] = cart.map((item: CartItem) => {
      const name = item.itemName || 'Unknown Item';
      const price = parseFloat(String(item.itemPrice ?? 0));
      const quantity = parseInt(String(item.itemQuantity ?? 1), 10);
      const itemTotal = price * quantity;

      subtotal += itemTotal;

      return {
        name,
        price,
        quantity,
        total: itemTotal,
        customization: item.customization || undefined   // <-- keep the text
      };
    });

    // Calculate 5% tax
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    console.log('Formatted cart:', formattedCart);
    console.log('Subtotal:', subtotal);
    console.log('Tax (5%):', tax);
    console.log('Total with tax:', total);

    // Update component properties
    this.cartItems = formattedCart;
    this.subtotal = subtotal;
    this.tax = tax;
    this.total = total;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    const checkoutData = {
      ...this.formData,
      // keep the detailed items INCLUDING customization
      cartItems: JSON.stringify(this.cartItems),
      subtotal: this.subtotal.toFixed(2),
      tax: this.tax.toFixed(2),
      cartTotal: this.total.toFixed(2),
      orderDate: new Date().toISOString()
    };

    this.appService.checkoutSubmission(checkoutData).subscribe({
      next: () => {
        localStorage.removeItem('cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        this.isSubmitting = false;
        this.router.navigate(['/success']);
      },
      error: (error) => {
        console.error('Error submitting checkout form:', error);
        this.isSubmitting = false;
        this.errorMessage = 'There was an error submitting your order. Please try again.';
      }
    });
  }

  isFormValid(): boolean {
    return Object.values(this.formData).every(value => value.trim() !== '');
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }
}

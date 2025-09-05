import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

interface CartItem {
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemCustomizations?: string[];
  itemImage?: string;
}

interface FormattedCartItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  
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
      console.log('Processing item:', item);
      
      // Handle different possible property names
      const name = item.itemName || 'Unknown Item';
      const price = parseFloat(String(item.itemPrice || 0));
      const quantity = parseInt(String(item.itemQuantity || 1));
      const itemTotal = price * quantity;
      
      subtotal += itemTotal;
      
      return {
        name: name,
        price: price,
        quantity: quantity,
        total: itemTotal
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
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    // Prepare checkout data for submission
    const checkoutData = {
      ...this.formData,
      cartItems: JSON.stringify(this.cartItems),
      subtotal: this.subtotal.toFixed(2),
      tax: this.tax.toFixed(2),
      cartTotal: this.total.toFixed(2),
      orderDate: new Date().toISOString()
    };

    // Submit using AppService
    this.appService.checkoutSubmission(checkoutData).subscribe({
      next: (response) => {
        // Clear the cart from localStorage
        localStorage.removeItem('cart');
        
        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        alert('Order placed successfully! You will receive a confirmation email shortly.');
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting checkout form:', error);
        alert('There was an error submitting your order. Please try again.');
        this.isSubmitting = false;
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

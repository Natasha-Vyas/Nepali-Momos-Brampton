import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public successMsg: boolean = false;
  public cart: any[] = [];
  public totalPrice: number = 0;
  public isLoading: boolean = false;
  public cartresponse: any;
  public css: any;
  public menu: any;
  public hero: any;
  public contact: any;
  public brandName: any;
  public email: any;
  public totalCartValue: any;
  public token: any;
  public cartItem = JSON.parse(localStorage.getItem('cart') || '[]');
  public subTotal = parseFloat(
    this.cartItem.reduce((total: number, item: any) => {
      return total + (item.itemQuantity * item.itemPrice);
    }, 0).toFixed(2)
  );
  checkOutDetails = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    phone: new FormControl(""),
    email: new FormControl(""),
    address: new FormControl(""),
    city: new FormControl(""),
    eventDate: new FormControl(['', Validators.required]),
    eventTime: new FormControl(''),
    state: new FormControl(""),
    country: new FormControl(""),
    pincode: new FormControl(""),
  });
  constructor(private router: Router, private appService: AppService, private seoService: SeoService) {

    this.brandName = this.appService.getContentData('brandName');
    this.contact = this.appService.getContentData('contact');
    this.email = this.appService.getContentData('email');
    this.hero = this.appService.getContentData('hero');
    this.menu = this.appService.getContentData('menu')[0];
    this.css = this.appService.getContentData('css');
  }
  ngOnInit(): void {
    this.cart = this.safeParse<any[]>(localStorage.getItem('cart'), []);
    this.totalPrice = this.safeParse<number>(localStorage.getItem('totalPrice'), 0);
  }

  submitCheckOutDetailsForm() {
    let body = {
      user: {
        ...this.checkOutDetails.value,
      },
      cart: this.cart,
      restaurantName: this.brandName,
      restaurantEmail: this.email,
      restaurantPhone: this.contact,
      totalCartValue: this.totalPrice
    }
    this.appService.cartCheckout(body).subscribe(res => {
      this.successMsg = true;
      localStorage.clear();
    })
  }

  private safeParse<T>(value: string | null, fallback: T): T {
    try {
      return value !== null ? JSON.parse(value) as T : fallback;
    } catch {
      return fallback;
    }
  }


}

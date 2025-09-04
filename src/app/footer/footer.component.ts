import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletterEmail: string = '';
  currentYear: number = new Date().getFullYear();
  hero: any = {};
  social: any = {};
  brandName: any = '';
  logo: any = '';
  address: any = '';
  phone: any = '';
  email: any = '';

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.social = this.appService.getContentData('social') || {};
    this.brandName = this.appService.getContentData('brandName') || '';
    this.address = this.appService.getContentData('address') || '';
    this.phone = this.appService.getContentData('phone') || '';
    this.email = this.appService.getContentData('email') || '';
    this.logo = this.appService.getContentData('logo') || 'assets/images/logo.png';
  }

  onNewsletterSubmit(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // Handle newsletter subscription
      console.log('Newsletter subscription for:', this.newsletterEmail);
      // You can add your newsletter subscription logic here
      // For example, call a service to subscribe the user
      
      // Reset the form after successful submission
      this.newsletterEmail = '';
      
      // Show success message (you can implement a toast service)
      alert('Thank you for subscribing to our newsletter!');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

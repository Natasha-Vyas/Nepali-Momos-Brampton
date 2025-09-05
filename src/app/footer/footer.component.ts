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
  isSubmitting: boolean = false;

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
      this.isSubmitting = true;

      // Submit using AppService which handles Formspark integration
      this.appService.newsletterSubscription(this.newsletterEmail).subscribe({
        next: (response) => {
          alert('Thank you for subscribing to our newsletter!');
          this.newsletterEmail = '';
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error submitting newsletter subscription:', error);
          alert('There was an error subscribing to the newsletter. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

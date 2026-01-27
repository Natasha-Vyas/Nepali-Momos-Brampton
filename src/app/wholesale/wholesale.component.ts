import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
@Component({
  selector: 'app-wholesale',
  templateUrl: './wholesale.component.html',
  styleUrls: ['./wholesale.component.scss']
})
export class WholesaleComponent implements OnInit {

  formData = {
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    notes: ''
  };

  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit(): void {
  }

  contactUs(): void {
    this.router.navigate(['/contact-us']);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    this.appService.wholesaleInquiry(this.formData).subscribe({
      next: () => {
        this.resetForm();
        this.successMessage = 'Thanks for your inquiry! We will contact you shortly.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        this.errorMessage = 'There was an error sending your inquiry. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  isFormValid(): boolean {
    return (
      this.formData.businessName.trim() !== '' &&
      this.formData.contactName.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.formData.businessType.trim() !== ''
    );
  }

  resetForm(): void {
    this.formData = {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      businessType: '',
      notes: ''
    };
    this.errorMessage = '';
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}

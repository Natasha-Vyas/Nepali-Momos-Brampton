import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  // Form data
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private appService: AppService, private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updateSeoTags('contact');
  }

  onSubmit(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    // Submit using AppService which handles Formspark integration
    this.appService.contactUsSubmission(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Thank you for your message! We will get back to you soon.';
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        this.errorMessage = 'There was an error sending your message. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  isFormValid(): boolean {
    return Object.values(this.formData).every(value => value.trim() !== '');
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    // Clear messages when form is reset
    this.errorMessage = '';
    this.successMessage = '';
  }
}

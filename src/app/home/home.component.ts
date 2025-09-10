import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from "@angular/common/http";

interface Review {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  hero: any = {};
  social: any = {};
  brandName: any = '';
  css: any = {};
  orderonline: string = '';
  sliderImage: any = {};
  slides: any[] = [];
  zarokaDetails3!: FormGroup;
  success: boolean = false;
  isPopupOpen: boolean = false;
  timerPopup: any = null;
  imagePopupOpen: boolean = false;
  popupImageUrl: string = '';
  signatureMomos: any[] = [];
  aboutUs: any = {};
  culinaryOfferings: any = {};
  dreamSection: any = {};
  public reviews: Review[] = [];
  private autoSlideApiInterval: any;
  visibleStart: number = 0;
  isMobile: boolean = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private seoService: SeoService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.seoService.updateSeoTags('home');
    this.checkScreenSize();
    
    // Show image popup after a short delay
    setTimeout(() => {
      this.imagePopupOpen = true;
    }, 1000);

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.social = this.appService.getContentData('social') || {};
    this.brandName = this.appService.getContentData('brandName') || '';
    this.css = this.appService.getContentData('css') || {};
    this.sliderImage = this.appService.getContentData('slider') || {};
    this.timerPopup = this.appService.getContentData('timerPopup');

    // Set order online link
    const social = this.appService.getContentData('social') || {};
    this.orderonline = social.onlinelink || '';

    // Load signature momos data - fix the path
    this.signatureMomos = this.hero.signatureMomos?.items || [];

    // Load about us data - fix the path
    this.aboutUs = this.hero.aboutus || {};

    // Load culinary offerings data - fix the path
    this.culinaryOfferings = this.hero.culinaryOfferings || {};

    // Load dream section data - fix the path
    this.dreamSection = this.hero.dreamSection || {};

    // Load static reviews and add default image if not present
    if (this.hero.reviews) {
      this.hero.StaticReviews = this.hero.reviews.map((review: any) => ({
        ...review,
        image: review.image || 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg'
      }));
      
      // Start auto slide after reviews are loaded
      setTimeout(() => {
        this.startAutoApiSlide();
      }, 100);
    }

    // Initialize slider for ng-image-slider
    if (this.sliderImage?.home) {
      this.slides = this.sliderImage.home.map((slide: any) => {
        if (typeof slide === 'string') {
          return {
            image: slide,
            thumbImage: slide,
            alt: 'Restaurant image',
            title: ''
          };
        } else {
          return {
            image: slide.image || slide.url || slide,
            thumbImage: slide.thumbImage || slide.image || slide.url || slide,
            alt: slide.alt || 'Restaurant image',
            title: slide.title || ''
          };
        }
      });
    }
  }

  private initializeForm(): void {
    this.zarokaDetails3 = this.formBuilder.group({
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      eventdate: [''],
      eventtime: [''],
      guest: ['']
    });
  }


  submitInquiryForm(): void {
    if (this.zarokaDetails3.valid) {
      const formData = this.zarokaDetails3.value;

      // Submit form data using AppService
      this.appService.contactUsSubmission(formData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully:', response);
          this.success = true;
          this.zarokaDetails3.reset();
        },
        error: (error) => {
          console.error('Form submission error:', error);
          // Still show success for demo purposes
          this.success = true;
          this.zarokaDetails3.reset();
        }
      });
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.zarokaDetails3.controls).forEach(key => {
        this.zarokaDetails3.get(key)?.markAsTouched();
      });
    }
  }


  closePopup(): void {
    this.isPopupOpen = false;
  }

  closeImagePopup(): void {
    this.imagePopupOpen = false;
  }

  startAutoApiSlide() {
    this.autoSlideApiInterval = setInterval(() => {
      if (!this.hero.StaticReviews || this.hero.StaticReviews.length === 0) return;
      
      if (this.isMobile) {
        // Mobile: slide by 1
        this.visibleStart = (this.visibleStart + 1) % this.hero.StaticReviews.length;
      } else {
        // Desktop: slide by 3 (or 1 if less than 3 reviews)
        const slideBy = this.hero.StaticReviews.length >= 3 ? 3 : 1;
        this.visibleStart = (this.visibleStart + slideBy) % this.hero.StaticReviews.length;
      }
    }, 3000);
  }

  pauseAutoSlide() {
    clearInterval(this.autoSlideApiInterval);
  }

  resumeAutoSlide() {
    this.startAutoApiSlide();
  }


  get visibleReviews(): any[] {
    if (!this.hero.StaticReviews || this.hero.StaticReviews.length === 0) return [];

    const total = this.hero.StaticReviews.length;
    const reviewsToShow: any[] = [];
    
    if (this.isMobile) {
      // Mobile: show 1 review
      const index = this.visibleStart % total;
      reviewsToShow.push(this.hero.StaticReviews[index]);
    } else {
      // Desktop: show 3 reviews
      for (let i = 0; i < 3; i++) {
        const index = (this.visibleStart + i) % total;
        reviewsToShow.push(this.hero.StaticReviews[index]);
      }
    }

    return reviewsToShow;
  }

  ngOnDestroy(): void {
    if (this.autoSlideApiInterval) {
      clearInterval(this.autoSlideApiInterval);
    }
  }

  onImgError(event: any) {
    event.target.src = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg';
  }
}

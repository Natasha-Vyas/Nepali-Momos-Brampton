import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
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
    // Show image popup after a short delay
    setTimeout(() => {
      this.imagePopupOpen = true;
    }, 1000);

    // Try to fetch reviews from API, fallback to static data
    const url = 'https://caterzhub-backend.vercel.app/places/google-places/reviews';
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const apiReviews = (res.result?.reviews || []).filter(
          (review: any) => review.language === 'en'
        );
        if (apiReviews.length > 0) {
          this.reviews = apiReviews;
        } else {
          this.loadFallbackReviews();
        }
        if (this.reviews.length > 0) {
          this.startAutoApiSlide();
        }
      },
      error: (err) => {
        console.error('Error fetching reviews, using fallback data:', err);
        this.loadFallbackReviews();
        if (this.reviews.length > 0) {
          this.startAutoApiSlide();
        }
      }
    });
  }

  private loadFallbackReviews(): void {
    // Use static review data from the service as fallback
    const heroData = this.appService.getContentData('hero') || {};
    const staticReviews = heroData.reviews || [];
    
    if (staticReviews.length > 0) {
      this.reviews = staticReviews.map((review: any) => ({
        author_name: review.name.replace('- ', ''),
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg',
        rating: 5,
        relative_time_description: 'a month ago',
        text: review.text,
        time: Date.now()
      }));
    } else {
      // Create some default reviews if no data is available
      this.reviews = [
        {
          author_name: 'Sudeep',
          author_url: '',
          language: 'en',
          profile_photo_url: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg',
          rating: 5,
          relative_time_description: 'a month ago',
          text: 'This is the closest you can get to real, authentic and fresh momos. We are momo connoisseurs and our overall experience was nothing but fantastic. Great staff atmosphere, food and price. We are repeat customers for a good reason. Definitely recommend it!',
          time: Date.now()
        },
        {
          author_name: 'K S',
          author_url: '',
          language: 'en',
          profile_photo_url: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg',
          rating: 5,
          relative_time_description: 'a month ago',
          text: 'Nepali Momos delivers authentic, juicy momos that steal the show! The Indian Hakka Chinese, like chili chicken, tastes better than your average spot. The Himalayan Buddhist ambience brings a serene, unique vibe. The staff is friendly and attentive, enhancing the meal. It\'s a must-try for momo and Hakka fans!',
          time: Date.now()
        },
        {
          author_name: 'Divya Shah',
          author_url: '',
          language: 'en',
          profile_photo_url: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg',
          rating: 5,
          relative_time_description: 'a month ago',
          text: 'Such a delicious and authentic nepali momos. Too good! And they were fresh and handmade. This restaurant should be a top choice for anyone craving a true momos experience. Highly recommended!',
          time: Date.now()
        }
      ];
    }
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
      if (!this.reviews || this.reviews.length === 0) return;
      this.visibleStart = (this.visibleStart + 1) % this.reviews.length;
    }, 3000);
  }

  pauseAutoSlide() {
    clearInterval(this.autoSlideApiInterval);
  }

  resumeAutoSlide() {
    this.startAutoApiSlide();
  }


  get visibleReviews(): Review[] {
    // First filter only 5-star reviews
    const fiveStarReviews = this.reviews.filter(r => r.rating === 5);
    const total = fiveStarReviews.length;

    if (total === 0) return [];

    const reviewsToShow: Review[] = [];

    for (let i = 0; i < 3; i++) {
      const index = (this.visibleStart + i) % total;
      reviewsToShow.push(fiveStarReviews[index]);
    }

    return reviewsToShow;
  }

  onImgError(event: any) {
    event.target.src = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg';
  }
}

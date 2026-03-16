import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('popupVideo', { static: false }) popupVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('nmAudio', { static: false }) nmAudio!: ElementRef<HTMLAudioElement>;
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;

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
  public isVideoPopupOpen: boolean = false;
  aboutUs: any = {};
  culinaryOfferings: any = {};
  dreamSection: any = {};
  public reviews: Review[] = [];
  private autoSlideApiInterval: any;
  visibleStart: number = 0;
  isMobile: boolean = false;
  popupTitle = 'Meet Momos Dai - Our Momo Master';
  popupDescription = 'He stands for everything we love: fresh ingredients, Nepali tradition, and momos made with love for our Brampton community.';
  popupVideoUrl = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/70088033-d7fe-46ec-b85a-b3f95af4aae0_Logo_and_Wink_Edit_Request%20%281%29.mp4';
  heroBannerImage: string = '';
  heroVideoUrl: string = '';
  heroImage = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/53962755-3984-442b-8926-4e876a3a359f_seasonal-hero-cny-2026.jpg';

  title = 'Seasonal Décor at Nepali Momos Brampton';

  subtitle = 'This season, Nepali Momos Brampton is beautifully decorated with Sakura cherry blossoms and vibrant spring accents. The soft pink blossoms create a warm and inviting atmosphere where guests can relax, take photos, and enjoy authentic Himalayan momos and delicious dumplings in a lively spring setting.';
  cloverLink = 'https://www.clover.com/online-ordering/nepali-momos-brampton-brampton'
  fineText = 'Chinese New Year begins Feb 17, 2026.';

  highlights = [
    'Glowing red lanterns & lucky knots',
    'Warm lighting + festive vibes',
    'A perfect spot for friends & family'
  ];

  gallery = [
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/faa26866-7867-4f0a-ba74-c0ce1707a56e_42021ade-a6f9-4e10-a794-2089fc2947bc.jpg',
      alt: 'Nepali Momos Brampton restaurant interior'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/69b47038-c1e3-4244-bb19-45dfccc1e733_533e1260-6975-46f8-912f-e9bbc95af848.jpg',
      alt: 'Nepali Momos Brampton dining area'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/7eeaf099-a87d-4344-9924-dc860bc30b60_6f75e26b-a6bd-407e-a658-0192182209ae.jpg',
      alt: 'Nepali Momos Brampton restaurant view'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/7cdf53af-4d9c-4c3d-bc65-3e2013b70d2c_9b360dcd-8b4f-4e1c-8623-d7d90ba73bce.jpg',
      alt: 'Nepali Momos Brampton seating area'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/d036d2ad-3797-42ab-a381-fc89d88cacf0_bf4f2615-9849-4c8b-8d90-6610f759d7d2.jpg',
      alt: 'Nepali Momos Brampton kitchen view'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/5ac212df-4ccb-4a0f-9899-8afc6794d655_c7c96c3f-6fe9-4929-9949-ac519772b343.jpg',
      alt: 'Nepali Momos Brampton counter area'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/206cca1b-c068-4033-b809-9539d205c2ef_cd966ad2-6c0e-4463-92bf-a31703c7755b.jpg',
      alt: 'Nepali Momos Brampton restaurant atmosphere'
    },
    {
      src: 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/f855371f-96f7-4891-8068-89a264f95510_def812d8-4ca2-4e44-94f3-a47f83ec6d85.jpg',
      alt: 'Nepali Momos Brampton interior design'
    }
  ];

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

    // Create petals after DOM is ready
    setTimeout(() => {
      this.createPetals();
    }, 100);

    setTimeout(() => {
      this.isPopupOpen = true;
    }, 400);

    // Show image popup after a short delay
    setTimeout(() => {
      this.imagePopupOpen = true;
    }, 1000);

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });

    // Initialize hero video
    this.initHeroVideo();
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

    // Banner media
    this.heroBannerImage = this.hero.homeImages?.[0]
      || 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/0670782a-bbec-4e26-84c3-0ea082c54d6c_WhatsApp%20Image%202025-10-23%20at%2008.jpeg';
    this.heroVideoUrl = this.hero.homeVideo
      || 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/55173658-3206-4380-86f9-17c1f8504ddb_video.mp4';
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

  // Video popup methods
  showVideoPopup(): void {
    this.isVideoPopupOpen = true;
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Ensure video plays when popup opens
    setTimeout(() => {
      if (this.popupVideo && this.popupVideo.nativeElement) {
        this.popupVideo.nativeElement.play().catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
    }, 100);
  }

  closeVideoPopup(): void {
    this.isVideoPopupOpen = false;
    // Restore body scrolling
    document.body.style.overflow = 'auto';

    // Pause video when popup closes
    if (this.popupVideo && this.popupVideo.nativeElement) {
      this.popupVideo.nativeElement.pause();
      this.popupVideo.nativeElement.currentTime = 0;
    }
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
    // Clean up petals from hero section
    const heroSection = document.querySelector('.nm-sakura');
    if (heroSection) {
      const petals = heroSection.querySelectorAll('.nm-petal');
      petals.forEach(petal => petal.remove());
    }
  }

  onImgError(event: any) {
    event.target.src = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg';
  }

  scrollToSection(id: string, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  createPetals(): void {
    const heroSection = document.querySelector('.nm-sakura');
    if (heroSection) {
      for (let i = 0; i < 35; i++) {
        const petal = document.createElement('div');
        petal.className = 'nm-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (12 + Math.random() * 10) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        heroSection.appendChild(petal);
      }
    }
  }

  nmMusicToggle(): void {
    if (this.nmAudio && this.nmAudio.nativeElement) {
      const audio = this.nmAudio.nativeElement;
      audio.volume = 0.25;
      
      if (audio.paused) {
        audio.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      } else {
        audio.pause();
      }
    }
  }

  onVideoLoaded(): void {
    console.log('Video loaded event triggered');
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;
      console.log('Video element found, attempting to play');
      
      // Ensure video properties are set
      video.loop = true;
      video.autoplay = true;
      
      video.play().then(() => {
        console.log('Video started playing successfully');
      }).catch(error => {
        console.log('Hero video autoplay failed:', error);
        // Try again on user interaction
        document.addEventListener('click', () => {
          video.play().catch(e => console.log('Video play on click failed:', e));
        }, { once: true });
      });
    } else {
      console.log('Video element not found');
    }
  }

  initHeroVideo(): void {
    setTimeout(() => {
      if (this.heroVideo && this.heroVideo.nativeElement) {
        const video = this.heroVideo.nativeElement;
        console.log('Initializing hero video manually');
        
        video.loop = true;
        video.autoplay = true;
        
        video.play().then(() => {
          console.log('Manual video play successful');
        }).catch(error => {
          console.log('Manual video play failed:', error);
        });
      }
    }, 1000);
  }
}

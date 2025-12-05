import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
}
@Component({
  selector: 'app-home-two',
  templateUrl: './home-two.component.html',
  styleUrls: ['./home-two.component.scss']
})
export class HomeTwoComponent implements OnInit, OnDestroy {
  hero: any = {};
  currentSlide: number = 0;
  sliderInterval: any;
  images: string[] = [];
  public reviews: Review[] = [];
  public visibleStart: number = 0;
  public autoSlideApiInterval: any;
  public social: any;
  public success = false;
  public logo: any;

  constructor(
    private appService: AppService,
    private seoService: SeoService
  ) {

    this.social = this.appService.getContentData('social');
    this.logo = this.appService.getContentData('logo');
  }

  newsLetter = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    address: new FormControl("")
  });

  ngOnInit(): void {
    this.loadData();
    this.seoService.updateSeoTags('about');
    this.initializeSlider();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  private loadData(): void {
    this.hero = this.appService.getContentData('hero') || {};
    this.images = this.hero.homeTwo?.images || [];
  }

  private initializeSlider(): void {
    if (this.images.length > 1) {
      this.sliderInterval = setInterval(() => {
        this.nextSlide();
      }, 4000); // 4 seconds interval
    }
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

  submitNewsLetterForm() {
    let body = {
      ...this.newsLetter.value
    }
    this.appService.newsletterSubmission(body).subscribe(result => {
      this.success = true;
    });
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
  onImgError(event: any) {
    event.target.src = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/a2a553a4-ba1f-4c01-89d7-f28df5c39293_person.jpg';
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

}

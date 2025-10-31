import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

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

  constructor(
    private appService: AppService,
    private seoService: SeoService
  ) { }

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

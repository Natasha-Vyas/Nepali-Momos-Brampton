import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  hero: any = {};

  constructor(
    private appService: AppService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.seoService.updateSeoTags('about');
  }

  private loadData(): void {
    this.hero = this.appService.getContentData('hero') || {};
  }

}

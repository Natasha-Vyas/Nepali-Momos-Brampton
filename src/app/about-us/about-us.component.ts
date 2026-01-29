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
  cartCount = 0;

  retail50 = [
    { name: 'Veggi', desc: 'Includes famed chutney', price: '$45' },
    { name: 'Ckn', desc: 'Includes famed chutney', price: '$50' },
    { name: 'Paneer', desc: 'Includes famed chutney', price: '$55' },
    { name: 'Malai Paneer', desc: 'Includes famed chutney', price: '$60' }
  ];

  retail15 = [
    { name: 'Veggi', price: '$15' },
    { name: 'Ckn', price: '$15' },
    { name: 'Paneer', price: '$16' },
    { name: 'Malai Paneer', price: '$18' }
  ];

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

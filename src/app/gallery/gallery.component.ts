import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  hero: any = {};
  social: any = {};
  gallery: any = {};

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.social = this.appService.getContentData('social') || {};
    this.gallery = this.appService.getContentData('gallery') || {};
    
  }

}

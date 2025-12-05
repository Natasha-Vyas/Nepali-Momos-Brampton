import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  hero: any = { onlineOrdering: [] };
  brandName: string = '';
  logo: string = '';
  css: any = {};
  links: any[] = [];
  close: boolean = true;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loadData();
  }

  change(): void {
    this.close = !this.close;
  }

  closeMenu(): void {
    this.close = true;
  }

  private loadData(): void {
    const heroData = this.appService.getContentData('hero') || {};
    this.hero = { ...heroData, onlineOrdering: heroData.onlineOrdering || [] };
    this.brandName = this.appService.getContentData('brandName') || '';
    this.logo = this.appService.getContentData('logo') || 'assets/images/logo.png';
    this.css = this.appService.getContentData('css') || {};
    const navbarData = this.appService.getContentData('navbar');
    this.links = navbarData?.links || [];
  }
}

import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen: boolean = false;
  hero: any = {};
  brandName: any = '';
  logo: any = '';

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.brandName = this.appService.getContentData('brandName') || '';
    this.logo = this.appService.getContentData('logo') || 'assets/images/logo.png';
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}

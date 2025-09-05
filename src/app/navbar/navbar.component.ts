import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from '../services/app.service';
import { filter } from 'rxjs/operators';

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
  cartItemCount: number = 0;
  showCartIcon: boolean = false;
  currentRoute: string = '';

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
    this.loadCartCount();
    this.checkCurrentRoute();
    
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navigationEndEvent = event as NavigationEnd;
      this.currentRoute = navigationEndEvent.url;
      this.checkCurrentRoute();
    });

    // Listen for cart updates
    window.addEventListener('cartUpdated', (event: any) => {
      this.cartItemCount = event.detail?.count || 0;
    });

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.loadCartCount();
      }
    });
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.brandName = this.appService.getContentData('brandName') || '';
    this.logo = this.appService.getContentData('logo') || 'assets/images/logo.png';
  }

  private checkCurrentRoute(): void {
    this.currentRoute = this.router.url;
    // Show cart icon only on cart, catering, and menu pages
    this.showCartIcon = this.currentRoute === '/cart' || this.currentRoute === '/catering' || this.currentRoute === '/menu';
  }

  private loadCartCount(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      // Count unique items, not total quantity
      this.cartItemCount = cart.length;
    } else {
      this.cartItemCount = 0;
    }
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}

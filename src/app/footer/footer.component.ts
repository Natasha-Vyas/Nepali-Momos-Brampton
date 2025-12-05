import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public template: any;
  public footerlogo: any;
  public footerText: any;
  public css: any;
  public links: any;
  public social: any;
  public openingHours: any;
  public deliveryTimes: any;
  public openingTimes: any;
  public brandName: any;
  public footerQuote: any;
  public address: any;
  public address2: any;
  public address3: any;
  public contact: any;
  public contactNew: any;
  public emailid: any;
  public hero: any;

  constructor(private appService: AppService) {
    this.template = this.appService.getContentData('template');
    this.footerlogo = this.appService.getContentData('footerlogo');
    this.footerText = this.appService.getContentData('footerText');
    this.emailid = this.appService.getContentData('email');
    this.css = this.appService.getContentData('css');
    this.openingTimes = this.appService.getContentData('openingTimes');
    this.deliveryTimes = this.appService.getContentData('deliveryTimes');
    this.openingHours = this.appService.getContentData('openingHours');
    this.social = this.appService.getContentData('social');
    this.links = this.appService.getContentData('navbar').links;
    this.footerQuote = this.appService.getContentData('footerQuote');
    this.brandName = this.appService.getContentData('brandName');
    this.address = this.appService.getContentData('address');
    this.address2 = this.appService.getContentData('address2');
    this.address3 = this.appService.getContentData('address3');
    this.contact = this.appService.getContentData('contact');
    this.contactNew = this.appService.getContentData('contactNew');
    this.hero = this.appService.getContentData('hero');
  }

  ngOnInit(): void {
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}

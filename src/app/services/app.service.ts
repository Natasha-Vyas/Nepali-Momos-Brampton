import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as nepaliMomosData from '../../assets/data/nepaliMomos.json';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public data: any;
    public website: any;
    public formCode: any;
    public reservationFormCode: any;
    public favIcon: HTMLLinkElement | null = document.querySelector('#appIcon');
    public apiUrl = 'https://gkc-backend.vercel.app';

    constructor(private http: HttpClient) {
        // Initialize with default data
        this.data = nepaliMomosData;
        this.website = 'nepalimomosbrampton.com';
        this.formCode = 'B7DJ0Vf9R';
    }

    getData(website: any) {
        switch (website) {
            case 'nepalimomosbrampton.com':
            case 'www.nepalimomosbrampton.com':
                if (this.favIcon) {
                    this.favIcon.href = 'https://s3.ap-south-1.amazonaws.com/cdn.ghc.health/33b9d659-275f-4ffb-a992-8e93659789d0_image%20%282%29.png';
                }
                this.formCode = 'B7DJ0Vf9R';
                return nepaliMomosData;
            default:
                return nepaliMomosData;
        }
    }

    getContentData(key: string): any {
        // Get data from the JSON file based on the key
        if (this.data && this.data[key]) {
            return this.data[key];
        }

        // Fallback for specific keys that might be needed
        const fallbackData: { [key: string]: any } = {
            templatetype: this.data?.type || 'template6new',
            hero: this.data?.hero || {},
            social: this.data?.social || {},
            story: this.data?.story || {},
            blogs: this.data?.story || {}, // Using story data for blogs
            brandName: this.data?.brandName || 'Nepali Momos Brampton',
            css: this.data?.css || {},
            type: this.data?.type || 'template6new'
        };

        return fallbackData[key] || null;
    }


    contactUsSubmission(data: any): Observable<any> {
        let requestBody = {
            ...data,
            type: 'Contact Us'
        };
        return this.http.post(
            `https://submit-form.com/${this.formCode}`,
            requestBody
        );
    }

    cartCheckout(data: any): Observable<any> {
        let requestBody = {
            user: data.user,
            cart: data.cart,
            restaurantName: data.restaurantName,
            restaurantEmail: data.restaurantEmail,
            restaurantPhone: data.restaurantPhone,
            totalCartValue: data.totalCartValue
        };
        return this.http.post(`${this.apiUrl}/checkout/checkout`, requestBody);
    }

    newsletterSubmission(data: any): Observable<any> {
        let requestBody = {
            ...data,
            type: 'Newsletter'
        };
        return this.http.post(
            `https://submit-form.com/${this.formCode}`,
            requestBody
        );
    }

    cateringInquiry(data: any): Observable<any> {
        let requestBody = {
            ...data,
            type: 'Catering Inquiry'
        };
        return this.http.post(
            `https://submit-form.com/${this.formCode}`,
            requestBody
        );
    }

    checkoutSubmission(data: any): Observable<any> {
        let requestBody = {
            ...data,
            type: 'Checkout Order'
        };
        return this.http.post(
            `https://submit-form.com/${this.formCode}`,
            requestBody
        );
    }

    newsletterSubscription(email: string): Observable<any> {
        let requestBody = {
            email: email,
            type: 'Newsletter Subscription'
        };
        return this.http.post(
            `https://submit-form.com/${this.formCode}`,
            requestBody
        );
    }
}
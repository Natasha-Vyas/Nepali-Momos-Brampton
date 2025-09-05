import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private seoData = {
    home: {
      title: "Authentic Nepali Momos in Brampton - Taste the Heart of the Himalayas",
      description: "Discover authentic Nepali momos crafted with care and passion at Nepali Momos Brampton. Experience handcrafted Himalayan flavors, family legacy, and nationwide delivery. Visit us today!"
    },
    menu: {
      title: "Menu | Nepali Momos Brampton – Handcrafted Himalayan Flavors",
      description: "Explore the delicious menu of Nepali Momos Brampton. From classic steamed to crispy momos, each bite brings the authentic taste of the Himalayas. Order online or visit us today!"
    },
    catering: {
      title: "Catering Services by Nepali Momos Brampton - Authentic Himalayan Flavors for Your Event",
      description: "Add a unique touch to your next event with Nepali Momos Brampton's catering services. Enjoy authentic, handcrafted momos with customizable options for all tastes. Perfect for corporate events, parties, and more!"
    },
    cart: {
      title: "Shopping Cart - Nepali Momos Brampton",
      description: "Review your order and proceed to checkout. Authentic Nepali momos and Himalayan flavors delivered fresh to your door."
    },
    checkout: {
      title: "Checkout - Nepali Momos Brampton",
      description: "Complete your order for authentic Nepali momos and Himalayan flavors. Fast delivery and secure payment options available."
    },
    gallery: {
      title: "Momo Gallery | Authentic Darjeeling Momos in Canada",
      description: "Explore the Aslee Momo's Ki Dukan gallery—authentic handcrafted Darjeeling-style momos made with tradition and passion. A visual taste of Canada’s favorite momos."
    },
    contact: {
      title: "Contact Nepali Momos Brampton – We'd Love to Hear From You!",
      description: "Get in touch with Nepali Momos Brampton for inquiries, orders, or delivery info. Visit us at 90 Eastern Ave, Brampton, or contact us via phone or email. We're here to help!"
    },
    about: {
      title: "About Nepali Momos Brampton - A Family Legacy of Authentic Momos",
      description: "Learn about Nepali Momos Brampton, founded by Sajeev from Darjeeling. Discover how our passion for traditional Himalayan momos has blossomed into a family business with a legacy of flavor."
    }
  };

  constructor(private meta: Meta, private title: Title) { }

  updateSeoTags(page: string) {
    const seo = this.seoData[page as keyof typeof this.seoData];
    
    if (seo) {
      // Update page title
      this.title.setTitle(seo.title);
      
      // Update meta description
      this.meta.updateTag({ name: 'description', content: seo.description });
      
      // Update Open Graph tags
      this.meta.updateTag({ property: 'og:title', content: seo.title });
      this.meta.updateTag({ property: 'og:description', content: seo.description });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      
      // Update Twitter Card tags
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: seo.title });
      this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    }
  }

  getSeoData(page: string) {
    return this.seoData[page as keyof typeof this.seoData];
  }
}
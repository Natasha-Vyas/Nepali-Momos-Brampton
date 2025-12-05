import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CateringComponent } from './catering/catering.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CartComponent } from './cart/cart.component';
import { MenuTwoComponent } from './menu-two/menu-two.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';
import { HomeTwoComponent } from './home-two/home-two.component';
import { StoriesComponent } from './stories/stories.component';
import { WholesaleComponent } from './wholesale/wholesale.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: `home`,
    component: HomeComponent
  },
  {
    path: `home-two`,
    component: HomeTwoComponent
  },
  {
    path: `menu/:name`,
    component: MenuComponent
  },
  { path: 'catering', component: CateringComponent },
  { path: 'cart', component: CartComponent },
  {
    path: `menutwo/:name`,
    component: MenuTwoComponent
  },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'success', component: SuccessComponent },
  {
    path: `stories`,
    component: StoriesComponent
  },
  {
    path: 'wholesale',
    component: WholesaleComponent
  },
  { path: '**', redirectTo: '/home-two', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

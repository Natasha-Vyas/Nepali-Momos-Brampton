import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {
  orderId = sessionStorage.getItem('lastOrderId') || '';
  total = sessionStorage.getItem('lastOrderTotal') || '';

  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['/']);
  }
}

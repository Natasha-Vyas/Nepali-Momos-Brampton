import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wholesale',
  templateUrl: './wholesale.component.html',
  styleUrls: ['./wholesale.component.scss']
})
export class WholesaleComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  contactUs(): void {
    this.router.navigate(['/contact-us']);
  }

}

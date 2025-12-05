import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {
  public hero: any;
  public story: any;
  constructor(private appService: AppService) {
    this.story = this.appService.getContentData('story');
    this.hero = this.appService.getContentData('hero');
  }

  ngOnInit(): void {
  }

}

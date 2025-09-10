import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
  hero: any = {};
  social: any = {};
  gallery: any[] = [];
  isModalOpen: boolean = false;
  currentModalIndex: number = -1;
  videoMuteStates: boolean[] = [];

  constructor(private appService: AppService, private seoService: SeoService) { }

  ngOnInit(): void {
    this.loadData();
    this.seoService.updateSeoTags('gallery');
  }

  ngOnDestroy(): void {
    // Restore body scroll when component is destroyed
    document.body.style.overflow = 'auto';
  }

  private loadData(): void {
    // Load all required data from AppService
    this.hero = this.appService.getContentData('hero') || {};
    this.social = this.appService.getContentData('social') || {};
    
    // Get gallery data and transform it to the expected format
    const galleryData = this.appService.getContentData('gallery') || [];
    this.gallery = galleryData.map((src: string) => ({
      src: src,
      type: this.getItemType(src)
    }));
    
    // Initialize video mute states (all videos start muted)
    this.videoMuteStates = new Array(this.gallery.length).fill(true);
  }

  getItemType(src: string): string {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    // Check if the source ends with any of the video extensions
    if (videoExtensions.some(ext => src.endsWith(ext))) {
      return 'video';
    }

    // Check if the source ends with any of the image extensions
    if (imageExtensions.some(ext => src.endsWith(ext))) {
      return 'image';
    }

    return 'unknown'; // Fallback, in case it's an unsupported file type
  }

  // Video control methods
  togglePlay(video: HTMLVideoElement): void {
    if (video.paused) {
      video.play().catch(error => {
        console.log('Video play failed:', error);
      });
    } else {
      video.pause();
    }
  }

  toggleMute(video: HTMLVideoElement, index: number): void {
    video.muted = !video.muted;
    this.videoMuteStates[index] = video.muted;
  }

  getVideoMuteState(index: number): boolean {
    return this.videoMuteStates[index];
  }

  onVideoLoaded(video: HTMLVideoElement): void {
    // Ensure video starts muted
    video.muted = true;
  }

  // Modal functionality
  openModal(index: number): void {
    this.currentModalIndex = index;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentModalIndex = -1;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  nextItem(): void {
    if (this.currentModalIndex < this.gallery.length - 1) {
      this.currentModalIndex++;
    } else {
      this.currentModalIndex = 0; // Loop to first item
    }
  }

  previousItem(): void {
    if (this.currentModalIndex > 0) {
      this.currentModalIndex--;
    } else {
      this.currentModalIndex = this.gallery.length - 1; // Loop to last item
    }
  }

  // Keyboard navigation using HostListener
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;
    
    switch (event.key) {
      case 'Escape':
        this.closeModal();
        break;
      case 'ArrowRight':
        this.nextItem();
        break;
      case 'ArrowLeft':
        this.previousItem();
        break;
    }
  }
}

import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() description = '';
  @Input() videoUrl = '';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('popupVideo', { static: false }) popupVideo?: ElementRef<HTMLVideoElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.playMutedVideo(), 0);
      } else {
        document.body.style.overflow = 'auto';
        this.resetVideo();
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
    this.resetVideo();
  }

  close(): void {
    this.closed.emit();
  }

  private playMutedVideo(): void {
    if (!this.popupVideo?.nativeElement) {
      return;
    }

    const video = this.popupVideo.nativeElement;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.play().catch(() => {
      // Ignore autoplay errors; controls let the user play manually.
    });
  }

  private resetVideo(): void {
    if (!this.popupVideo?.nativeElement) {
      return;
    }

    const video = this.popupVideo.nativeElement;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }
}

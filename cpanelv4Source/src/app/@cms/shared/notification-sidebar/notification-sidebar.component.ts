import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cms-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class CmsNotificationSidebarComponent implements OnInit, OnDestroy {

  layoutSub: Subscription;
  isOpen = false;

  @ViewChild('sidebar', {static: false}) sidebar: ElementRef;

  ngOnInit() {

  }

  constructor(private elRef: ElementRef,
    private renderer: Renderer2,
    private layoutService: LayoutService) {

    this.layoutSub = layoutService.notiSidebarChangeEmitted$.subscribe(
      value => {
        if (this.isOpen) {
          this.renderer.removeClass(this.sidebar.nativeElement, 'open');
          this.isOpen = false;
        }
        else {
          this.renderer.addClass(this.sidebar.nativeElement, 'open');
          this.isOpen = true;
        }
      });
  }

  ngOnDestroy() {
    if(this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }



  onClose() {
    this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    this.isOpen = false;
  }

}

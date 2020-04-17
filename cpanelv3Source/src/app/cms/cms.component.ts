import { Component } from '@angular/core';
import { MENU_ITEMS } from '../pages/pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['cms.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class CmsComponent {

  menu = MENU_ITEMS;
}

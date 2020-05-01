import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsContentComponent } from './newsContent.component';
import { NewsContentRoutes } from './newsContent.routing';

@NgModule({
  imports: [
    CommonModule,
    NewsContentRoutes
  ],
  declarations: [NewsContentComponent]
})
export class NewsContentModule { }

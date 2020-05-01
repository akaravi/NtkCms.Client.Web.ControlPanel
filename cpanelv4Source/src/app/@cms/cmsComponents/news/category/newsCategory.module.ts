import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCategoryComponent } from './newsCategory.component';
import { NewsCategoryRoutes } from './newsCategory.routing';

@NgModule({
  imports: [
    CommonModule,
    NewsCategoryRoutes
  ],
  declarations: [NewsCategoryComponent]
})
export class NewsCategoryModule { }

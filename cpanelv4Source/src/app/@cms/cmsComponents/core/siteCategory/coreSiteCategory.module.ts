import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreSiteCategoryComponent } from './coreSiteCategory.component';
import { CoreSiteCategoryRoutes } from './coreSiteCategory.routing';

@NgModule({
  imports: [
    CommonModule,
    CoreSiteCategoryRoutes
  ],
  declarations: [CoreSiteCategoryComponent]
})
export class CoreSiteCategoryModule { }

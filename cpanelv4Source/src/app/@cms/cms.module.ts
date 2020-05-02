import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from './cms.component';
import { CmsRoutes } from './cms.routing';
import { CmsFullLayoutComponent } from './layouts/full/cmsFull-layout.component';
import { CmsContentLayoutComponent } from './layouts/content/cmsContent-layout.component';
import { SharedModule } from 'app/shared/shared.module';
import { CmsSharedModule } from './shared/cmsShared.module';

@NgModule({
  imports: [
    CommonModule,
    CmsRoutes,
    SharedModule,
    CmsSharedModule
  ],
  declarations: [   
    CmsFullLayoutComponent,
    CmsContentLayoutComponent,]
})
export class CmsModule { }

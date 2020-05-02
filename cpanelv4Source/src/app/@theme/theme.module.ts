import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeComponent } from './theme.component';
import { ThemeRoutes } from './theme.routing';
import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';
import { ThemeSharedModule } from './shared/themeShared.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeRoutes,
    SharedModule,
    ThemeSharedModule
  ],
  declarations: [ 
    FullLayoutComponent,
    ContentLayoutComponent,]
})
export class ThemeModule { }

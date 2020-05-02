import { Routes, RouterModule } from '@angular/router';
import { CmsFullLayoutComponent } from './layouts/full/cmsFull-layout.component';
import { FullLayoutROUTES } from './routes/full-layout.routes';
import { CmsContentLayoutComponent } from './layouts/content/cmsContent-layout.component';
import { ContentLayoutROUTES } from './routes/content-layout.routes';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/dashboard1',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CmsFullLayoutComponent,
    data: { title: 'full Views' },
    children: FullLayoutROUTES,
    //canActivate: [CmsAuthGuard],
  },
  {
    path: '',
    component: CmsContentLayoutComponent,
    data: { title: 'content Views' },
    children: ContentLayoutROUTES,
    //canActivate: [CmsAuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CmsRoutes {}

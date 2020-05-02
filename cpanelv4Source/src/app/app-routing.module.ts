import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from './@theme/layouts/full/full-layout.component';
import { ContentLayoutComponent } from './@theme/layouts/content/content-layout.component';

import { Full_ROUTES } from './@theme/routes/full-layout.routes';
import { CONTENT_ROUTES } from './@theme/routes/content-layout.routes';

import { AuthGuard } from './@theme/shared/auth/auth-guard.service';
import { CmsFullLayoutComponent } from './@cms/layouts/full/cmsFull-layout.component';
import { CmsContentLayoutComponent } from './@cms/layouts/content/cmsContent-layout.component';
import { ContentLayoutROUTES } from './@cms/routes/content-layout.routes';
import { FullLayoutROUTES } from './@cms/routes/full-layout.routes';
import { CmsAuthGuard } from './@cms/cmsService/core/auth.guard.service';

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
  },
  {
    path: 'theme',
    component: FullLayoutComponent,
    data: { title: 'full Views' },
    children: Full_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'theme',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'pages/error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

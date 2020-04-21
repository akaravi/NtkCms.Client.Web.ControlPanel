import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';

import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

import { AuthGuard } from './shared/auth/auth-guard.service';
import { CmsFullLayoutComponent } from './@cms/layouts/full/cmsFull-layout.component';
import { CmsContentLayoutComponent } from './@cms/layouts/content/cmsContent-layout.component';
import { ContentLayoutROUTES } from './@cms/routes/content-layout.routes';
import { FullLayoutROUTES } from './@cms/routes/full-layout.routes';
import { CmsAuthGuard } from './@cms/cmsPages/core/auth/auth-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/dashboard1',
    pathMatch: 'full',
  },
  { path: 'cms', component: CmsFullLayoutComponent, data: { title: 'full Views' }, children: FullLayoutROUTES, canActivate: [CmsAuthGuard] },
  { path: 'cms', component: CmsContentLayoutComponent, data: { title: 'content Views' }, children: ContentLayoutROUTES, canActivate: [CmsAuthGuard] },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES, canActivate: [AuthGuard] },
  {
    path: '**',
    redirectTo: 'pages/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

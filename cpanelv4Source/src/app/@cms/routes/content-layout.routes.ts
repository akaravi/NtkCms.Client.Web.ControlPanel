import { Routes, RouterModule } from '@angular/router';
import { CmsAuthGuard } from '../cmsService/core/auth.guard.service';

export const ContentLayoutROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then(m => m.CmsDashboardModule)
  },
  {
    path: 'site',
    canActivate: [CmsAuthGuard],
    loadChildren: () => import('../cmsPages/core/site/coreSite.module').then(m => m.CoreSiteModule)
  },
  //{
        // path: 'pages',
        // loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule)
    //}
];

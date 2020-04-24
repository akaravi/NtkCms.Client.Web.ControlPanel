import { Routes, RouterModule } from '@angular/router';

export const ContentLayoutROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then(m => m.CmsDashboardModule)
  },
  {
    path: 'site',
    loadChildren: () => import('../cmspages/core/site/site.module').then(m => m.SiteModule)
  },
  //{
        // path: 'pages',
        // loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule)
    //}
];

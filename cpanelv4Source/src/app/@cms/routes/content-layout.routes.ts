import { Routes, RouterModule } from '@angular/router';

export const ContentLayoutROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then(m => m.CmsDashboardModule)
  },
  //{
        // path: 'pages',
        // loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule)
    //}
];

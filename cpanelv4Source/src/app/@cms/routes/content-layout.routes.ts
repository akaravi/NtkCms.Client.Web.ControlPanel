import { Routes, RouterModule } from '@angular/router';

export const ContentLayoutROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../cmsPages/core/auth/auth.module').then(m => m.CmsAuthModule)
  }, 
  //{
        // path: 'pages',
        // loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule)
    //}
];

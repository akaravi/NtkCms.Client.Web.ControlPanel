import { Routes, RouterModule } from '@angular/router';

export const FullLayoutROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../cmsComponents/core/auth/auth.module').then(m => m.CoreAuthModule)
  }, 
  
];

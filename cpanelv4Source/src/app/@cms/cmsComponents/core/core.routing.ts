import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../core/auth/auth.module').then(m => m.CoreAuthModule),
      },
      {
        path: 'site',
        loadChildren: () => import('../core/site/coreSite.module').then(m => m.CoreSiteModule),
      },
      {
        path: 'sitecategory',
        loadChildren: () => import('../core/siteCategory/coreSiteCategory.module').then(m => m.CoreSiteCategoryModule),
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutes { }

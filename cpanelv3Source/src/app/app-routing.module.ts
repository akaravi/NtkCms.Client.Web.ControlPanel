import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
//import { NotFoundComponent } from './pages/miscellaneous/not-found/not-found.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // { path: '**', redirectTo: 'pages' },
  // {
  //   path: 'cms',
  //   loadChildren: () => import('./cms/cms.module')
  //     .then(m => m.CmsModule),
  // },
  
  {
    path: 'auth', loadChildren: () => import('./cms/core/auth/auth.module').then(m => m.AuthModule),
    data: { preload: false}},
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth2',
    loadChildren: () => import('./@theme/components/auth/auth.module')
      .then(m => m.NgxAuthModule),
  }
  // ,
  //   {
  //     path: '**',
  //     component: NotFoundComponent,
  //   }
 
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

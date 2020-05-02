import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { Full_ROUTES } from './@theme/routes/full-layout.routes';
import { FullLayoutROUTES } from './@cms/routes/full-layout.routes';
import { CmsComponent } from './@cms/cms.component';
import { ThemeComponent } from './@theme/theme.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/dashboard1',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CmsComponent,
    data: { title: 'Cms' },
    loadChildren: () => import('./@cms/cms.module').then(m => m.CmsModule)

    //children: FullLayoutROUTES,
  },
  {
    path: 'theme',
    component: ThemeComponent,
    data: { title: 'theme Views' },
    loadChildren: () => import('./@theme/theme.module').then(m => m.ThemeModule)

    //children: Full_ROUTES,
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

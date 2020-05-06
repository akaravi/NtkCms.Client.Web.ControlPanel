import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(m => m.NewsContentModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.NewsCategoryModule),
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutes { }

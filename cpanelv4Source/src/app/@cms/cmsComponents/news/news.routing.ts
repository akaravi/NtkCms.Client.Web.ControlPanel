import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'content',
        loadChildren: () => import('../news/content/newsContent.module').then(m => m.NewsContentModule),
      },
      {
        path: 'category',
        loadChildren: () => import('../news/category/newsCategory.module').then(m => m.NewsCategoryModule),
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutes { }

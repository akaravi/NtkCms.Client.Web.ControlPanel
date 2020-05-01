import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewsContentListComponent } from './list/newsContentList.component';
import { NewsContentAddComponent } from './add/newsContentAdd.component';
import { NewsContentEditComponent } from './edit/newsContentEdit.component';
import { NewsContentSelectComponent } from './select/newsContentSelect.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: NewsContentListComponent,
        data: {
          title: 'login to Panle',
        },
      },
      {
        path: 'add',
        component: NewsContentAddComponent,
        data: {
          title: 'Register New Acount',
        },
      },
      {
        path: 'edit',
        component: NewsContentEditComponent,
        data: {
          title: 'forgot password You Acount',
        },
      },
      {
        path: 'select',
        component: NewsContentSelectComponent,
        data: {
          title: 'forgot password You Acount',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsContentRoutes {}

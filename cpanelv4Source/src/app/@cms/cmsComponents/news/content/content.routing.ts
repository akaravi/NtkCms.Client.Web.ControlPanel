import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewsContentListComponent } from './list/contentList.component';
import { NewsContentAddComponent } from './add/ContentAdd.component';
import { NewsContentEditComponent } from './edit/ContentEdit.component';
import { NewsContentSelectComponent } from './select/contentSelect.component';


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

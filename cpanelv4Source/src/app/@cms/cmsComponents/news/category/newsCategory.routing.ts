import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewsCategoryListComponent } from './list/newsCategoryList.component';
import { NewsCategoryAddComponent } from './add/newsCategoryAdd.component';
import { NewsCategoryEditComponent } from './edit/newsCategoryEdit.component';
import { NewsCategorySelectComponent } from './select/newsCategorySelect.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: NewsCategoryListComponent,
        data: {
          title: 'login to Panle',
        },
      },
      {
        path: 'add',
        component: NewsCategoryAddComponent,
        data: {
          title: 'Register New Acount',
        },
      },
      {
        path: 'edit',
        component: NewsCategoryEditComponent,
        data: {
          title: 'forgot password You Acount',
        },
      },
      {
        path: 'select',
        component: NewsCategorySelectComponent,
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
export class NewsCategoryRoutes {}

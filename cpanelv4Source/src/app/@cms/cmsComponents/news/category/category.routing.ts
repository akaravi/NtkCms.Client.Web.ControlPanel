import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewsCategoryListComponent } from './list/categoryList.component';
import { NewsCategoryAddComponent } from './add/categoryAdd.component';
import { NewsCategoryEditComponent } from './edit/categoryEdit.component';
import { NewsCategorySelectComponent } from './select/categorySelect.component';


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

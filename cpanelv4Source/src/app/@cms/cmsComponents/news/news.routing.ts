import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NewsContentListComponent } from './content/list/contentList.component';
import { NewsContentAddComponent } from './content/add/ContentAdd.component';
import { NewsContentEditComponent } from './content/edit/ContentEdit.component';
import { NewsContentSelectComponent } from './content/select/contentSelect.component';
import { NewsCategoryListComponent } from './category/list/categoryList.component';
import { NewsCategoryAddComponent } from './category/add/categoryAdd.component';
import { NewsCategoryEditComponent } from './category/edit/categoryEdit.component';
import { NewsCategorySelectComponent } from './category/select/categorySelect.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "content",
        children: [
          {
            path: "",
            component: NewsContentListComponent,
            data: {
              title: "login to Panle",
            },
          },
          {
            path: "list",
            component: NewsContentListComponent,
            data: {
              title: "login to Panle",
            },
          },
          {
            path: "add",
            component: NewsContentAddComponent,
            data: {
              title: "Register New Acount",
            },
          },
          {
            path: "edit",
            component: NewsContentEditComponent,
            data: {
              title: "forgot password You Acount",
            },
          },
          {
            path: "select",
            component: NewsContentSelectComponent,
            data: {
              title: "forgot password You Acount",
            },
          },
        ],

      },
      {
        path: "category",
        children: [
          {
            path: "",
            component: NewsCategoryListComponent,
            data: {
              title: "login to Panle",
            },
          },
          {
            path: "list",
            component: NewsCategoryListComponent,
            data: {
              title: "login to Panle",
            },
          },
          {
            path: "add",
            component: NewsCategoryAddComponent,
            data: {
              title: "Register New Acount",
            },
          },
          {
            path: "edit",
            component: NewsCategoryEditComponent,
            data: {
              title: "forgot password You Acount",
            },
          },
          {
            path: "select",
            component: NewsCategorySelectComponent,
            data: {
              title: "forgot password You Acount",
            },
          },
        ],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutes {}

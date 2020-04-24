import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SiteSelectComponent } from "./select/select.component";
import { SiteEditComponent } from "./edit/edit.component";
import { SiteListComponent } from "./list/list.component";
import { SiteAddComponent } from "./add/add.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "list",
        component: SiteListComponent,
        data: {
          title: "login to Panle",
        },
      },
      {
        path: "add",
        component: SiteAddComponent,
        data: {
          title: "Register New Acount",
        },
      },
      {
        path: "edit",
        component: SiteEditComponent,
        data: {
          title: "forgot password You Acount",
        },
      },
      {
        path: "select",
        component: SiteSelectComponent,
        data: {
          title: "forgot password You Acount",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutes {}

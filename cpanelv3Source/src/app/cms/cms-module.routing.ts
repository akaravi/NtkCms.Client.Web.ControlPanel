import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { NewsContentListComponent } from './news/newsContentList/newsContentList.component';
import { NewsContentAddComponent } from './news/newsContentAdd/newsContentAdd.component';
import { NewsContentEditComponent } from './news/newsContentEdit/newsContentEdit.component';

const routes: Routes = [{
   path:'',
    component:NewsContentListComponent,
  // children:[
  //   { path:"list" ,component:NewsContentListComponent},
  //   { path:"add",component:NewsContentAddComponent},
  //   { path:"edit" ,component:NewsContentEditComponent}] 
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsModuleRoutes {
}
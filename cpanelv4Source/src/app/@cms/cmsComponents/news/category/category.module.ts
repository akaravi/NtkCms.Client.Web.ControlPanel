import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCategoryRoutes } from './category.routing'
import { NewsCategoryAddComponent } from './add/categoryAdd.component';
import { NewsCategoryEditComponent } from './edit/categoryEdit.component';
import { NewsCategoryListComponent } from './list/categoryList.component';
import { NewsCategorySelectComponent } from './select/categorySelect.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    NewsCategoryRoutes,
    NgxDatatableModule,
    TreeModule.forRoot(),
  ],
  declarations: [
    NewsCategoryAddComponent,
    NewsCategoryEditComponent,
    NewsCategoryListComponent,
    NewsCategorySelectComponent]
})
export class NewsCategoryModule { }

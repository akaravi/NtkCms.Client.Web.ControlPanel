import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCategoryRoutes } from './newsCategory.routing';
import { NewsCategoryAddComponent } from './add/newsCategoryAdd.component';
import { NewsCategoryEditComponent } from './edit/newsCategoryEdit.component';
import { NewsCategoryListComponent } from './list/newsCategoryList.component';
import { NewsCategorySelectComponent } from './select/newsCategorySelect.component';

@NgModule({
  imports: [
    CommonModule,
    NewsCategoryRoutes
  ],
  declarations: [
    NewsCategoryAddComponent,
    NewsCategoryEditComponent,
    NewsCategoryListComponent,
    NewsCategorySelectComponent]
})
export class NewsCategoryModule { }

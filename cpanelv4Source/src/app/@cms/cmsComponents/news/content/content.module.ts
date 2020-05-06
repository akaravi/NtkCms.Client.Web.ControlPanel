import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsContentRoutes } from './content.routing';
import { NewsContentAddComponent } from './add/ContentAdd.component';
import { NewsContentEditComponent } from './edit/ContentEdit.component';
import { NewsContentListComponent } from './list/contentList.component';
import { NewsContentSelectComponent } from './select/contentSelect.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { NewsCategorySelectComponent } from '../category/select/categorySelect.component';

@NgModule({
  imports: [
    CommonModule,
    NewsContentRoutes,
    NgxDatatableModule,
    TreeModule.forRoot(),
  ],
  declarations: [
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentListComponent,
    NewsContentSelectComponent,
    NewsCategorySelectComponent,
  ]
})
export class NewsContentModule { }

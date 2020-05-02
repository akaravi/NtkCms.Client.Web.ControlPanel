import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsContentRoutes } from './newsContent.routing';
import { NewsContentAddComponent } from './add/newsContentAdd.component';
import { NewsContentEditComponent } from './edit/newsContentEdit.component';
import { NewsContentListComponent } from './list/newsContentList.component';
import { NewsContentSelectComponent } from './select/newsContentSelect.component';

@NgModule({
  imports: [
    CommonModule,
    NewsContentRoutes
  ],
  declarations: [
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentListComponent,
    NewsContentSelectComponent
  ]
})
export class NewsContentModule { }

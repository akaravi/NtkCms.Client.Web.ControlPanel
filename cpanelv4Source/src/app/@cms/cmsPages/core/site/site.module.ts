import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { SiteComponent } from './site.component';
import { SiteRoutes } from './site.routing';
import { SiteListComponent } from './list/list.component';
import { SiteAddComponent } from './add/add.component';
import { SiteEditComponent } from './edit/edit.component';
import { SiteSelectComponent } from './select/select.component';

@NgModule({
  imports: [
    CommonModule,
    SiteRoutes,
    NgbModule,
    FormsModule,
  ],
  declarations: [
    SiteComponent,
    SiteListComponent,
    SiteAddComponent,
    SiteEditComponent,
    SiteSelectComponent]
})
export class SiteModule { }

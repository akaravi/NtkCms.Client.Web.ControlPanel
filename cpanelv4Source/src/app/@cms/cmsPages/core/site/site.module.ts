import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { CoreSiteComponent } from './site.component';
import { CoreSiteRoutes } from './site.routing';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreSiteSelectComponent } from './select/select.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CoreSiteRoutes,
  ],
  declarations: [
    CoreSiteComponent,
    CoreSiteListComponent,
    CoreSiteAddComponent,
    CoreSiteEditComponent,
    CoreSiteSelectComponent]
})
export class CoreSiteModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { CoreSiteComponent } from './coreSite.component';
import { CoreSiteRoutes } from './coreSite.routing';
import { CoreSiteListComponent } from './list/coreSiteList.component';
import { CoreSiteAddComponent } from './add/coreSiteAdd.component';
import { CoreSiteEditComponent } from './edit/coreSiteEdit.component';
import { CoreSiteSelectComponent } from './select/select.component';
import {PersianDate} from '../../_base/pipe/PersianDatePipe/persian-date.pipe';
import {PersianTimeAgoPipe} from 'persian-time-ago-pipe';
import {JdatePipe} from 'ngx-persian';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CoreSiteRoutes
    
  ],
  declarations: [
    CoreSiteComponent,
    CoreSiteListComponent,
    CoreSiteAddComponent,
    CoreSiteEditComponent,
    CoreSiteSelectComponent,
    PersianDate,
    PersianTimeAgoPipe,
    JdatePipe]
})
export class CoreSiteModule { }

import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';

import { CmsComponent } from './cms.component';
import { CmsModuleRoutes } from './cms-module.routing';

@NgModule({
  imports: [
    CmsModuleRoutes,
    ThemeModule,
    NbMenuModule,
  ],
  declarations: [CmsComponent,
  ],
})
export class CmsModule {
 }

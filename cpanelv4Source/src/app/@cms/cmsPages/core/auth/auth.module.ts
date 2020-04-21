import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutes } from './auth.routing';


@NgModule({
    imports: [
        CommonModule,
        AuthRoutes,
        ChartistModule,
        NgbModule,
    ],
    exports: [],
    declarations: [
      LoginComponent,
      RegisterComponent
    ],
    providers: [],
})
export class CmsAuthModule { }


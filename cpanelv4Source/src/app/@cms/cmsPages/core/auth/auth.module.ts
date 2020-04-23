import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutes } from './auth.routing';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';


@NgModule({
    imports: [
        CommonModule,
        AuthRoutes,
        ChartistModule,
        NgbModule,
        FormsModule,
    ],
    exports: [],
    declarations: [
      LoginComponent,
      RegisterComponent,
      ForgotPasswordComponent 
    ],
    providers: [],
})
export class CmsAuthModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

//import { ChartistModule } from 'ng-chartist';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutes } from './auth.routing';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { AuthComponent } from './auth.component';


@NgModule({
    imports: [
        CommonModule,
        AuthRoutes,
        NgbModule,
        FormsModule,
        //ChartistModule,

    ],
    exports: [],
    declarations: [
      AuthComponent,
      LoginComponent,
      RegisterComponent,
      ForgotPasswordComponent
    ],
    providers: [],
})
export class CmsAuthModule { }


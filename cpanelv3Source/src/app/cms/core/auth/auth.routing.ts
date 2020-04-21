import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginRedirectGuard } from '../../_base/guards/login-redirect.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {path: 'login', canActivate: [LoginRedirectGuard], component: LoginComponent,
      data: {title: ['ورود به پنل کاربری']}},
      {path: 'register', component: RegisterComponent,
      data: {title: ['ثبت نام در مادپی']}}
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutes { }

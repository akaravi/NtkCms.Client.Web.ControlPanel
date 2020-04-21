import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
//import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
constructor(private router: Router, private authService: AuthService//, private alertService: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.loggedIn()) {
      return true;
    } else {
        this.router.navigate([this.authService.getDashboardUrl()]);
        //this.alertService.warning('شما قبلا وارد شده اید', 'موفق');
        alert('شما قبلا وارد شده اید');
        return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
//import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router,
            //private alertService: ToastrService
            ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.loggedIn()) {
      const roles = route.data.roles as Array<string>;
      if (roles) {
        const match = this.authService.roleMatch(roles);
        if (match) {
          return true;
        } else {
          //this.alertService.error('عدم دسترسی به این بخش', 'خطا');
          alert('عدم دسترسی به این بخش');
          this.router.navigate([this.authService.getDashboardUrl()]);
        }
      } else {
          return true;
      }
    } else {
      //this.alertService.error('شما به این بخش دسترسی ندارید', 'عدم دسترسی');
      alert('شما به این بخش دسترسی ندارید');
      this.router.navigate(['/auth/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}

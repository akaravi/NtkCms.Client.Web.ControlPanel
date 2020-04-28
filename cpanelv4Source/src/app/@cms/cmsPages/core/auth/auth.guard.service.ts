import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CmsAuthService } from './auth.service';

@Injectable()
export class CmsAuthGuard implements CanActivate {

  constructor(private authService: CmsAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated();
  }
}

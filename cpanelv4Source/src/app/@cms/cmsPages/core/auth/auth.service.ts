import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cmsServerConfig } from 'app/@cms/cmsCommon/environments/cmsServerConfig';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../cmsStore';
import { TokenInfoModel } from 'app/@cms/cmsModels/base/tokenInfoModel';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';

@Injectable()
export class CmsAuthService implements OnDestroy {
  subManager = new Subscription();

  token: string;
  baseUrl = cmsServerConfig.configApiServerPath + 'auth/';
  jwtHelper = new JwtHelperService();
  userRoles: string[] = [];
  userName = '';

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>
  ) {
    const token = localStorage.getItem('token');
    if (this.loggedIn()) {
      const decode = this.jwtHelper.decodeToken(token);
      this.userRoles = decode.role as Array<string>;
      this.userName = decode.unique_name;
    }
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  signupUser(model: any) {
    return this.http.post(this.baseUrl + 'signup', model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success('با موفقیت ثبت نام شدید', 'موفق');
          } else {
            this.alertService.error(ret.ErrorMessage, 'خطا در ثبت نام');
          }
          return ret;
        }
      })
    );
  }

  signinUser(model: any) {
    return this.http.post(this.baseUrl + 'signin', model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.store.dispatch(new fromStore.EditLoggedUser(ret.Item));
            const decodedToken = this.jwtHelper.decodeToken(ret.token);
            this.store.dispatch(new fromStore.EditDecodedToken(decodedToken));
            this.userRoles = decodedToken.role as Array<string>;
            this.alertService.success('با موفقیت وارد شدید', 'موفق');

            localStorage.setItem('token', ret.token);
            localStorage.setItem('refreshToken', ret.Item.refresh_token);
          } else {
            this.alertService.error(ret.ErrorMessage, 'خطا در ورود');
          }
          return ret;
        }
      })
    );
  }

  RenewToken(model: AuthRenewTokenModel) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    return this.http.post(this.baseUrl + 'renewToken', model, { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.store.dispatch(new fromStore.EditLoggedUser(ret.Item));
            const decodedToken = this.jwtHelper.decodeToken(ret.token);
            this.store.dispatch(new fromStore.EditDecodedToken(decodedToken));
            this.userRoles = decodedToken.role as Array<string>;
            this.alertService.success('با موفقیت وارد شدید', 'موفق');

            localStorage.setItem('token', ret.token);
            localStorage.setItem('refreshToken', ret.Item.refresh_token);
          } else {
            this.alertService.error(ret.ErrorMessage, 'خطا در ورود');
          }
          return ret;
        }
      })
    );
  }
  changePassword(model: any) {
    return this.http.post(this.baseUrl + 'changePassword', model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success('تغییر پسورد با موفقیت انجام شد', 'موفق');
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              'خطا در تغییر  پسورد حساب کاربری'
            );
          }
          return ret;
        }
      })
    );
  }
  forgetPassword(model: any) {
    return this.http.post(this.baseUrl + 'forgetPassword', model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success(
              'دستور عمل بازیابی پسورد به آدرس ایمیل شما ارسال شد',
              'موفق'
            );
          } else {
            this.alertService.error(ret.ErrorMessage, 'خطا در بازیابی پسورد');
          }
          return ret;
        }
      })
    );
  }
  logout() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'signOut', { headers: headers }).pipe(
      map((ret: any) => {
        if (ret) {
          this.token = null;
        }
      })
    );
  }

  getToken() {
    return this.token;
  }
  loggedIn() {
    let user: TokenInfoModel;
    this.subManager.add(
      this.store.select(fromStore.getLoggedUserState).subscribe((data) => {
        user = data;
      })
    );

    const token = localStorage.getItem('token');
    if (token == null || token == undefined) {
      return false;
    }
    let parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    let decoded = this.jwtHelper.urlBase64Decode(parts[1]);
    if (!decoded) {
      return false;
    }
    // if (user.provider === 'GOOGLE' || user.provider === 'FACEBOOK') {
    //   var socialUser: SocialUser;
    //   this.socialAuthService.authState.subscribe((user) => {
    //     socialUser = user;
    //   });
    //   if (socialUser == null) {
    //     return false
    //   }
    // }
    return true;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && !this.jwtHelper.isTokenExpired(token)) {
      let user: TokenInfoModel;
      this.subManager.add(
        this.store.select(fromStore.getLoggedUserState).subscribe((data) => {
          user = data;
        })
      );
      // if (user.provider === 'GOOGLE' || user.provider === 'FACEBOOK') {
      //   var socialUser: SocialUser;
      //   this.socialAuthService.authState.subscribe((user) => {
      //     socialUser = user;
      //   });
      //   if (socialUser == null) {
      //     return false
      //   }
      // }
      return true;
    } else {
      return true; // false;
    }
  }
  isAdmin(): boolean {
    if (this.roleMatch(['Admin'])) {
      return true;
    }
    return false;
  }
  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.userRoles;
    if (Array.isArray(userRoles)) {
      allowedRoles.forEach((element) => {
        if (userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      });
    } else {
      allowedRoles.forEach((element) => {
        if (userRoles === element) {
          isMatch = true;
          return;
        }
      });
    }
    return isMatch;
  }
  getDashboardUrl(): string {
    return '/cms/site/select';
  }
  getLoginUrl(): string {
    return '/cms/auth/login';
  }
}

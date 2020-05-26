import { Router } from "@angular/router";
import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import * as fromStore from "../../cmsStore";
import { TokenInfoModel } from "app/@cms/cmsModels/base/tokenInfoModel";
import { Subscription, BehaviorSubject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ErrorExcptionResult, ErrorExcptionResultBase } from "app/@cms/cmsModels/base/errorExcptionResult";
import {
  AuthRenewTokenModel,
  AuthUserSignOutModel,
  AuthUserSignInModel,
  AuthUserSignUpModel,
  AuthUserChangePasswordModel,
  AuthUserForgetPasswordModel,
} from "app/@cms/cmsModels/core/authModel";
import { environment } from "environments/environment";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { CoreUser } from "app/@cms/cmsModels/core/coreUser";

@Injectable()
export class CmsAuthService implements OnDestroy {

  CorrectTokenInfo = new BehaviorSubject<TokenInfoModel>(null);
  CorrectTokenInfoObs = this.CorrectTokenInfo.asObservable();

  subManager = new Subscription();

  tokenString: string;
  baseUrl = environment.cmsServerConfig.configApiServerPath + "auth/";
  jwtHelper = new JwtHelperService();
  userRoles: string[] = [];
  userName = "";

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>,
  ) {
    this.tokenString = localStorage.getItem("token");
    if (this.loggedIn()) {
      const decode = this.jwtHelper.decodeToken(this.tokenString);
      this.userRoles = decode.role as Array<string>;
      this.userName = decode.unique_name;
    }
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  CheckToken() {
    const token = localStorage.getItem('token');

    if (!token || token === 'null') {
      this.alertService.warning(
        'لطفا مجددا وارد حساب کاربری خود شوید',
        'نیاز به ورود مجدد'
      );
      this.router.navigate([environment.cmsUiConfig.Pathlogin]);

    }
    return token;
  }
  SetCorrectTokenInfo(model: TokenInfoModel) {
    if(model==null) model=new TokenInfoModel();
    this.CorrectTokenInfo.next(model);
  }
  CorrectTokenInfoRenew() {
    this.ServiceRenewToken(null).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.SetCorrectTokenInfo(next.Item);
        }
      },
      (error) => {

      }
    );
  }

  getHeaders() {
    const token = this.CheckToken();
    const headers = { Authorization: token };
    return headers;
  }
  ServiceSignupUser(model: AuthUserSignUpModel) {
    return this.http.post(this.baseUrl + "signup", model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success("با موفقیت ثبت نام شدید", "موفق");
          } else {
            this.alertService.error(ret.ErrorMessage, "خطا در ثبت نام");
          }
          return ret;
        }
      })
    );
  }

  ServiceSigninUser(model: AuthUserSignInModel) {
    return this.http.post(this.baseUrl + "signin", model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.store.dispatch(new fromStore.EditLoggedUser(ret.Item));
            const decodedToken = this.jwtHelper.decodeToken(ret.token);
            this.store.dispatch(new fromStore.EditDecodedToken(decodedToken));
            this.userRoles = decodedToken.role as Array<string>;
            this.alertService.success("با موفقیت وارد شدید", "موفق");

            this.SetCorrectTokenInfo(ret.Item);
            localStorage.setItem("token", ret.token);
            localStorage.setItem("refreshToken", ret.Item.refresh_token);
          } else {
            this.alertService.error(ret.ErrorMessage, "خطا در ورود");
          }
          return ret;
        }
      })
    );
  }

  ServiceRenewToken(model: AuthRenewTokenModel) {
    if(model==null) model=new AuthRenewTokenModel();
    return this.http
      .post(this.baseUrl + "renewToken", model, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResult<TokenInfoModel>) => {
          if (ret) {
            if (ret.IsSuccess) {
              this.store.dispatch(new fromStore.EditLoggedUser(ret.Item));
              const decodedToken = this.jwtHelper.decodeToken(ret.token);
              this.store.dispatch(new fromStore.EditDecodedToken(decodedToken));
              this.userRoles = decodedToken.role as Array<string>;
              //this.alertService.success("با موفقیت وارد شدید", "موفق");

              this.SetCorrectTokenInfo(ret.Item);
              localStorage.setItem("token", ret.token);
              localStorage.setItem("refreshToken", ret.Item.refresh_token);
            } else {
              this.alertService.error(ret.ErrorMessage, "خطا در دریافت توکن");
            }
            return ret;
          }
        })
      );
  }
  ServiceChangePassword(model: AuthUserChangePasswordModel) {
    return this.http.post(this.baseUrl + "changePassword", model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success("تغییر پسورد با موفقیت انجام شد", "موفق");
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              "خطا در تغییر  پسورد حساب کاربری"
            );
          }
          return ret;
        }
      })
    );
  }
  ServiceForgetPassword(model: AuthUserForgetPasswordModel) {
    return this.http.post(this.baseUrl + "forgetPassword", model).pipe(
      map((ret: ErrorExcptionResult<TokenInfoModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success(
              "دستور عمل بازیابی پسورد به آدرس ایمیل شما ارسال شد",
              "موفق"
            );
          } else {
            this.alertService.error(ret.ErrorMessage, "خطا در بازیابی پسورد");
          }
          return ret;
        }
      })
    );
  }
  ServiceLogout( model: AuthUserSignOutModel = new AuthUserSignOutModel()
  ) {
    return this.http
      .post(this.baseUrl + "signOut", model, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResultBase) => {
          if (ret) {
            this.tokenString = null;

            this.SetCorrectTokenInfo(null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            this.alertService.success("خروح شما با موفقیت انجام شد", "موفق");

            return ret;
          }
        })
      );
  }

  ServiceExistToken(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(this.baseUrl + "existToken", model, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResultBase) => {
          if (ret) {
            return ret;
          }
        })
      );
  }

  getToken() {
    return this.tokenString;
  }
  loggedIn() {
    let user: TokenInfoModel;
    this.subManager.add(
      this.store.select(fromStore.getLoggedUserState).subscribe((data) => {
        user = data;
      })
    );

    const token = localStorage.getItem("token");
    if (token == null || token == undefined) {
      return false;
    }
    let parts = token.split(".");
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
    const token = this.CheckToken();
    if (token && token !== "null" && !this.jwtHelper.isTokenExpired(token)) {
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
    if (this.roleMatch(["Admin"])) {
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
    return "core/site/select";
  }
  getLoginUrl(): string {
    return "/auth/login";
  }
}

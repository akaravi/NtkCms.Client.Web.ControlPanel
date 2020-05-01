import { Injectable, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromStore from "../../cmsStore";
import { Subscription, throwError } from "rxjs";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { CmsAuthService } from "app/@cms/cmsService/core/auth.service";
import { retry, catchError } from "rxjs/operators";
import { cmsServerConfig } from 'environments/environment';

@Injectable({
  providedIn: "root",
})
export class ApiServerConfigSiteBaseService implements OnDestroy {
  subManager = new Subscription();
  public baseUrl = cmsServerConfig.configApiServerPath;

  constructor(
    public http: HttpClient,
    public alertService: ToastrService,
    public router: Router,
    public store: Store<fromStore.State>,
    public cmsAuthService: CmsAuthService,
    public publicHelper: PublicHelper
  ) {}
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  setModuleCotrolerUrl()
  {
  return "Empty";
  }
  errorExcptionResultCheck(model: ErrorExcptionResult<any>) {
    if (model) {
      if (model.IsSuccess) {
        if (model.token && model.token !== "null") {
          localStorage.setItem("token", model.token);
          localStorage.setItem("refreshToken", model.Item.refresh_token);
        }
      } else {
        this.alertService.error(model.ErrorMessage, "خطا در دریافت از سرور");
      }
    }
    return model;
  }

  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  ServiceSiteDefault() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return (
      this.http
        .get(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteDefault", {
          headers: headers,
        })
        // .pipe(
        //   retry(1),
        //   catchError(this.handleError)
        // );
        .pipe(
          map((ret: ErrorExcptionResult<any>) => {
            return this.errorExcptionResultCheck(ret);
          }, catchError(this.handleError))
        )
    );
  }
  ServiceSiteDefaultSave(
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl(), model, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteStorage(
    id: number,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteStorage/" + id, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteStorageSave(
    id: number,
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteStorage/" + id, model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

  ServiceSite(id: number, ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/Site/" + id, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteSave(
    id: number,
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/Site/" + id, model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccess(
    id: number,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteAccess/" + id, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessSave(
    id: number,
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteAccess/" + id, model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessDefault(
    id: number,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteAccessDefault/" + id, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessDefaultSave(
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/SiteAccessDefault/", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceAdminMain() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/AdminMain/", {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceAdminMainSave(
    model: any,
    
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/AdminMain/", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
}

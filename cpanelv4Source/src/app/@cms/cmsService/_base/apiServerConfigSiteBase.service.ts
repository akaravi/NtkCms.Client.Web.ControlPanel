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
import { cmsServerConfig } from "environments/environment";

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

  getModuleCotrolerUrl() {
    return "Empty";
  }
  getHeaders() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };  
    return headers;
  }
  errorExcptionResultCheck<TOut>(model: ErrorExcptionResult<TOut>) {
    if (model) {
      if (model.IsSuccess) {
        if (model.token && model.token !== "null") {
          localStorage.setItem("token", model.token);
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

  ServiceSiteDefault<TOut>() {
 
    return (
      this.http
        .get(this.baseUrl + this.getModuleCotrolerUrl() + "/SiteDefault", {
          headers: this.getHeaders(),
        })
        // .pipe(
        //   retry(1),
        //   catchError(this.handleError)
        // );
        .pipe(
          map((ret: ErrorExcptionResult<TOut>) => {
            return this.errorExcptionResultCheck<TOut>(ret);
          }, catchError(this.handleError))
        )
    );
  }
  ServiceSiteDefaultSave<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl(), model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteStorage<TOut>(id: number) {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/SiteStorage/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteStorageSave<TOut>(id: number, model: any) {
 
    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/SiteStorage/" + id,
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }

  ServiceSite<TOut>(id: number) {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/Site/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteSave<TOut>(id: number, model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/Site/" + id, model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccess<TOut>(id: number) {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/SiteAccess/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessSave<TOut>(id: number, model: any) {
 
    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/SiteAccess/" + id,
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessDefault<TOut>(id: number) {
 
    return this.http
      .get(
        this.baseUrl + this.getModuleCotrolerUrl() + "/SiteAccessDefault/" + id,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteAccessDefaultSave<TOut>(model: any) {
 
    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/SiteAccessDefault/",
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceAdminMain<TOut>() {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/AdminMain/", {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceAdminMainSave<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/AdminMain/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
}

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
import { CmsAuthService } from "app/@cms/cmsPages/core/auth/auth.service";
import { retry, catchError } from "rxjs/operators";
import { cmsServerConfig } from 'environments/environment';

@Injectable({
  providedIn: "root",
})
export class ApiServerConfigSiteBaseService implements OnDestroy {
  subManager = new Subscription();
  public baseUrl = cmsServerConfig.configApiServerPath;
  public moduleCotrolerUrl: string;

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
  setModuleCotrolerUrl(controllerPath: string) {
    this.moduleCotrolerUrl = controllerPath;
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

  ServiceSiteDefault(moduleControler: string = this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return (
      this.http
        .get(this.baseUrl + moduleControler + "/SiteDefault", {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler, model, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSiteStorage(
    id: number,
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/SiteStorage/" + id, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/SiteStorage/" + id, model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

  ServiceSite(id: number, moduleControler: string = this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/Site/" + id, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/Site/" + id, model, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/SiteAccess/" + id, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/SiteAccess/" + id, model, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/SiteAccessDefault/" + id, {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/SiteAccessDefault/", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceAdminMain(moduleControler: string = this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/AdminMain/", {
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
    moduleControler: string = this.moduleCotrolerUrl
  ) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/AdminMain/", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
}

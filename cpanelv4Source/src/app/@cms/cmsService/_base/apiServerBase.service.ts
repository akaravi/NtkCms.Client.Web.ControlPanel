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
import { cmsServerConfig, cmsUiConfig } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();
  public baseUrl = cmsServerConfig.configApiServerPath;
  public configApiRetry = cmsServerConfig.configApiRetry;
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
          //localStorage.setItem("refreshToken", model.Item.refresh_token);
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
      if (error.status == "401") {
        this.router.navigate([cmsUiConfig.Pathlogin]);
      }
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  ServiceModelInfo<TOut>() {
    return (
      this.http
        .get(this.baseUrl + this.getModuleCotrolerUrl() + "/ModelInfo", {
          headers: this.getHeaders(),
        })
        .pipe(
          retry(this.configApiRetry),
          catchError(this.handleError),
          map((ret: ErrorExcptionResult<TOut>) => {
            return this.errorExcptionResultCheck<TOut>(ret);
          })
        )
    );
  }
  ServiceViewModel<TOut>() {
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/GetViewModel", {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }

  ServiceGetAll<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/getAll", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceGetAllAvailable<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllAvailable",
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceGetOneById<TOut>(id: any) {
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceGetOne<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetOne", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceGetCount<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/PostCount", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceExportFile<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/ExportFile", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceAdd<TOut>(model: any) {
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/Add", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceAddBatch<TOut>(model: Array<any>) {
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/AddBatch", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceEdit<TOut>(model: any) {
    return this.http
      .put(this.baseUrl + this.getModuleCotrolerUrl() + "/Edit", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceEditBatch<TOut>(model: Array<any>) {
    return this.http
      .put(this.baseUrl + this.getModuleCotrolerUrl() + "/Edit", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceDelete<TOut>(model: any) {
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/Delete", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  
  ServiceDeleteList<TOut>(model: Array<any>) {
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/DeleteList", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceDeleteId<TOut>(model: any) {
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/DeleteId", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
  ServiceDeleteListId<TOut>(model: Array<any>) {
    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/DeleteListId",
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
}

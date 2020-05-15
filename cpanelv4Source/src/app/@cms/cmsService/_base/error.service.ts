import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CmsAuthService } from "../core/auth.service";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from "environments/environment";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  public baseUrl =environment. cmsServerConfig.configApiServerPath + "ErrorApi/";
  public configApiRetry =environment. cmsServerConfig.configApiRetry;

  constructor(
    public http: HttpClient,
    public alertService: ToastrService,
    public router: Router,
    public cmsAuthService: CmsAuthService,
    public publicHelper: PublicHelper
  ) {}

  getHeaders() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return headers;
  }
  ServiceErrorApi<TOut>(model: any) {
    return (
      this.http
        .post(this.baseUrl + "/Add", {
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
}

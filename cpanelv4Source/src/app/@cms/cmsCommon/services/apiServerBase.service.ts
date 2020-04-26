import { Injectable, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { cmsServerConfig } from "app/@cms/cmsCommon/environments/cmsServerConfig";
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
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class ApiServerBaseService implements OnDestroy {
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
  setModuleCotrolerUrl(controllerPath: string)
  {
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
    let errorMessage = '';
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
 
  ServiceModelInfo(moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/ModelInfo", { headers: headers })
      // .pipe(
      //   retry(1),
      //   catchError(this.handleError)
      // );
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }
        ,catchError(this.handleError)
        )
      );
  }
  ServiceViewModel(moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/GetViewModel", { headers: headers })
      // .pipe(
      //   retry(1),
      //   catchError(this.handleError)
      // );
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }
        ,catchError(this.handleError)
        )
      );
  }

  ServiceGetAll(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/getAll", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceGetAllAvailable(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/GetAllAvailable", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceGetOneById(id: any, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + moduleControler + "/" + id, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceGetOne(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/GetOne", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServicePostCount(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/PostCount", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceExportFile(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/ExportFile", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceAdd(model: any, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/Add", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceAddBatch(model: Array<any>, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/AddBatch", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceEdit(model: any, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .put(this.baseUrl + moduleControler + "/Edit", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceEditBatch(model: Array<any>, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .put(this.baseUrl + moduleControler + "/Edit", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceDelete(model: any, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/Delete", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceDeleteFilterModel(model: FilterModel, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/DeleteFilterModel", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceDeleteList(model: Array<any>, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/DeleteList", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceDeleteId(model: any, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/DeleteId", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
  ServiceDeleteListId(model: Array<any>, moduleControler: string=this.moduleCotrolerUrl) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + moduleControler + "/DeleteListId", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
}

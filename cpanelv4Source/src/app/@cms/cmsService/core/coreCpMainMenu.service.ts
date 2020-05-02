import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class CoreCpMainMenuService extends ApiServerBaseService
  implements OnDestroy {
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreCpMainMenu";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceGetAllMenu<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllMenu", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceEditStep<TOut>(model: any) {
 
    return this.http
      .put(this.baseUrl + this.getModuleCotrolerUrl() + "/EditStep", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
}

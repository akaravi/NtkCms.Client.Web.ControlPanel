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
  setModuleCotrolerUrl() {
    return "CoreCpMainMenu";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceGetAllMenu(model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllMenu", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceEditStep(model: any) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .put(this.baseUrl + this.setModuleCotrolerUrl() + "/EditStep", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
}

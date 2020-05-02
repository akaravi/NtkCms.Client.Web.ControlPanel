import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { catchError,map } from 'rxjs/operators';
@Injectable({
  providedIn: "root",
})
export class CoreUserService extends ApiServerBaseService
  implements OnDestroy {
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreUser";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceGetGlobalToken<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetGlobalToken", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }

}

import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { catchError,map, retry } from 'rxjs/operators';
@Injectable({
  providedIn: "root",
})
export class CoreSiteUserService extends ApiServerBaseService
  implements OnDestroy {
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreSiteUser";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceGetAllSiteUser<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllSiteUser", model, {
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
  ServiceGetCurrentSiteUsers<TOut>() {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/GetCurrentSiteUsers",  {
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
}

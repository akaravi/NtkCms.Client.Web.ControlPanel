import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { catchError, map, retry } from "rxjs/operators";
import { CoreUser } from "app/@cms/cmsModels/core/coreUser";
import { AuthService } from "app/@theme/shared/auth/auth.service";
@Injectable({
  providedIn: "root",
})
export class CoreUserService extends ApiServerBaseService implements OnDestroy {
  CorrectUser = new BehaviorSubject<CoreUser>(null);
  CorrectUserObs = this.CorrectUser.asObservable();
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreUser";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  SetCorrectUser(model: CoreUser) {
    if (model == null) model = new CoreUser();
    this.CorrectUser.next(model);
  }
  ServiceCurrectUser() {
      return this.http.get(this.baseUrl + this.getModuleCotrolerUrl() + "/CurrectUser",
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<CoreUser>) => {
          this.SetCorrectUser(ret.Item);
          return this.errorExcptionResultCheck<CoreUser>(ret);
        })
      );
    
  }
  ServiceGetGlobalToken(model: FilterModel) {
    if (model == null) model = new FilterModel();

    return this.http
      .post(
        this.baseUrl + this.getModuleCotrolerUrl() + "/GetGlobalToken",
        model,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<CoreUser>) => {
          return this.errorExcptionResultCheck<CoreUser>(ret);
        })
      );
  }
}

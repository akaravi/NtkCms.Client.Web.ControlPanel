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
  setModuleCotrolerUrl() {
    return "CoreUser";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceGetGlobalToken(model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetGlobalToken", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

}

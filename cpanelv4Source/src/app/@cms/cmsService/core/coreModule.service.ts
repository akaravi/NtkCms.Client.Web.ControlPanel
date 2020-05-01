import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreModuleService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
    return 'CoreModule';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  
  ServiceGetAllByCategorySiteId(CategorySiteId: number ,model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllByCategorySiteId/"+CategorySiteId, model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  // ServiceSelectSite(model: AuthRenewTokenModel) {
  //   this.ServiceConstructor();
  //   return this.cmsAuthService.RenewToken(model);
  // }
  
}

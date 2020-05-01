import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'CoreSite';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceSelectSite(model: AuthRenewTokenModel) {
    return this.cmsAuthService.RenewToken(model);
  }
  ServiceDomains(id: any) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .get(this.baseUrl + this.setModuleCotrolerUrl() + "/Domains/" + id, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        },catchError(this.handleError))
      );
  }
}

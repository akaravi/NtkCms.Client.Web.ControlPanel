import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { ApiServerBaseService } from 'app/@cms/cmsCommon/services/apiServerBase.service';
@Injectable({
  providedIn: 'root',
})
export class CoreSiteService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();
  constructorIn()
  {
    this.setModuleCotrolerUrl('CoreSite');
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceSelectSite(model: AuthRenewTokenModel) {
    return this.cmsAuthService.RenewToken(model);
  }
}

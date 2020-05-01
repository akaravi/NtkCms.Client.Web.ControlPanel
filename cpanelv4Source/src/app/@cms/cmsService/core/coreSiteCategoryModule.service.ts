import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { ApiServerBaseService } from '../_base/apiServerBase.service';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteCategoryModuleService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();
  setModuleCotrolerUrl()
  {
   return 'CoreSiteCategoryCmsModule';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 

}

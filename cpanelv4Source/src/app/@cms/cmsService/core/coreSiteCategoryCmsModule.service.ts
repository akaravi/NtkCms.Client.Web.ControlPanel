import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteCategoryCmsModuleService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'CoreSiteCategoryCmsModule';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  
}

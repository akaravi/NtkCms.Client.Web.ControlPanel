import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
@Injectable({
  providedIn: 'root',
})
export class CoreUserBadLoginService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();
  setModuleCotrolerUrl()
  {
   return 'CoreUserBadLogin';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 

}

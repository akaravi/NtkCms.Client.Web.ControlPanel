import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerConfigSiteBaseService } from '../_base/apiServerConfigSiteBase.service';

@Injectable({
  providedIn: 'root',
})
export class CoreConfigurationService extends ApiServerConfigSiteBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'CoreConfiguration';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  
}

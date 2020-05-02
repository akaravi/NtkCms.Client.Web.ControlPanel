import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerConfigSiteBaseService } from '../_base/apiServerConfigSiteBase.service';

@Injectable({
  providedIn: 'root',
})
export class NewsConfigurationService extends ApiServerConfigSiteBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'NewsConfiguration';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  
}

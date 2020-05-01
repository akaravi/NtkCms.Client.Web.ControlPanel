import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';

@Injectable({
  providedIn: 'root',
})
export class CoreModuleProcessCustomizeService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'CoreModuleProcessCustomize';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  
}

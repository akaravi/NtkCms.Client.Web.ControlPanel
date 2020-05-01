import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';

@Injectable({
  providedIn: 'root',
})
export class NewsContentService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'NewsContent';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  
}

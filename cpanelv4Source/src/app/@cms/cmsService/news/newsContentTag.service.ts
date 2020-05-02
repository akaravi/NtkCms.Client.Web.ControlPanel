import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { catchError, map } from 'rxjs/operators';
import { SearchTagModel } from 'app/@cms/cmsModels/base/searchModel';

@Injectable({
  providedIn: 'root',
})
export class NewsContentTagService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'NewsContentTag';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceSearchTag<TOut>(model: SearchTagModel) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/SearchTag/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
}

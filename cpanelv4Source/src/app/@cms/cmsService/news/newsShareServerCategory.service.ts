import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { catchError, map, retry } from 'rxjs/operators';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class NewsShareServerCategoryService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'NewsShareServerCategory';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  ServiceGetAllOtherSite<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllOtherSite/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
}

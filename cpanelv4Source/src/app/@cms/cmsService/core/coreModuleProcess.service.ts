import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, catchError, retry } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreModuleProcessService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'CoreModuleProcess';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceAutoAdd<TOut>() {
    
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/AutoAdd/", {
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
  ServiceGetOneWithJsonFormatter<TOut>( model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetOneWithJsonFormatter/",model, {
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

  
  ServiceGetAllWithJsonFormatter<TOut>( model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllWithJsonFormatter/",model, {
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

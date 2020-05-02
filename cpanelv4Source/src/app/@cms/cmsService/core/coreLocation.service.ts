import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, catchError, retry } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreLocationService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
    return 'CoreLocation';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  
  ServiceGetAllProvinces<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllProvinces", model, {
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
  ServiceGetAllCities<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllCities", model, {
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
  ServiceGetAllNeighbourhoods<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllNeighbourhoods", model, {
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

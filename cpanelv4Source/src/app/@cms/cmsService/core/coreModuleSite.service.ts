import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class CoreModuleSiteService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'CoreModuleSite';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceConfigSite<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/ConfigSite", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceEditConfigSite<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/EditConfigSite", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllById<TOut>(id: number,  model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAll/"+id, model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  
}

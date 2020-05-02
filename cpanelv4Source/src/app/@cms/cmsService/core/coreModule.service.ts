import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreModuleService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
    return 'CoreModule';
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
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceConfig<TOut>(MoudleClassName:string) {
    
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/Config/",MoudleClassName, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetOneWithModuleConfig<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetOneWithModuleConfig/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetViewModelWithModuleConfig<TOut>(id:number) {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/GetViewModelWithModuleConfig/"+id, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllModuleName<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllModuleName/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllByCategorySiteId<TOut>(CategorySiteId: number ,model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllByCategorySiteId/"+CategorySiteId, model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }

}

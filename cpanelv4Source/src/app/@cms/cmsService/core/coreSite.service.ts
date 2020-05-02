import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { CoreSiteSearchModel } from 'app/@cms/cmsModels/core/coreSiteModel';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  getModuleCotrolerUrl()
  {
     return 'CoreSite';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceSelectSite(model: AuthRenewTokenModel) {
    return this.cmsAuthService.RenewToken(model);
  }

  ServiceWebScreenshot<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/WebScreenshot/" ,model, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        },catchError(this.handleError))
      );
  }
  ServiceAddFirstSite<TOut>(model: any) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/AddFirstSite/" ,model, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        },catchError(this.handleError))
      );
  }
  ServiceGetAllWithAlias<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllWithAlias", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllChildWithAlias<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllChildWithAlias", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSearchNew<TOut>(model: FilterModel) {
    if (model == null) model = new FilterModel();
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/SearchNew", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceSearch<TOut>(model: CoreSiteSearchModel) {
 
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/Search", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceDomain<TOut>() {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/Domain",  {
        headers: this.getHeaders(),
      })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceDomains<TOut>(id: number) {
 
    return this.http
      .get(this.baseUrl + this.getModuleCotrolerUrl() + "/Domains/" + id, { headers: this.getHeaders() })
      .pipe(
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        },catchError(this.handleError))
      );
  }
}

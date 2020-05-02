import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreLocationService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
    return 'CoreLocation';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  
  ServiceGetAllProvinces(model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllProvinces", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllCities(model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllCities", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetAllNeighbourhoods(model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllNeighbourhoods", model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

}

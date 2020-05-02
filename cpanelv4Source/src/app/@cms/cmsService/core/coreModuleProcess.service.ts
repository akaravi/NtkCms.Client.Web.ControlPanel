import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ApiServerBaseService } from '../_base/apiServerBase.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class CoreModuleProcessService extends ApiServerBaseService implements OnDestroy {
  subManager = new Subscription();

  setModuleCotrolerUrl()
  {
     return 'CoreModuleProcess';
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
 
  ServiceAutoAdd() {
    
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/AutoAdd/", {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }
  ServiceGetOneWithJsonFormatter( model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetOneWithJsonFormatter/",model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

  
  ServiceGetAllWithJsonFormatter( model: FilterModel) {
    if (model == null) model = new FilterModel();
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + this.setModuleCotrolerUrl() + "/GetAllWithJsonFormatter/",model, {
        headers: headers,
      })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          return this.errorExcptionResultCheck(ret);
        }, catchError(this.handleError))
      );
  }

  
}

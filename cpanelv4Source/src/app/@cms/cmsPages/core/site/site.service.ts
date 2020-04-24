import { Injectable, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { cmsServerConfig } from 'app/@cms/cmsCommon/environments/cmsServerConfig';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../cmsStore';
import { Subscription } from 'rxjs';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';

@Injectable({
  providedIn: 'root',
})
export class SiteService implements OnDestroy {
  subManager = new Subscription();
  private baseUrl = cmsServerConfig.configApiServerPath + 'CoreSite/';
  private token='';
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>
  ) {
    this.token = localStorage.getItem('token');
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  getAll(model: FilterModel) {
    const headers = { Authorization: this.token };
      return this.http.post(this.baseUrl + 'getAllwithalias', model,{ headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success('تغییر پسورد با موفقیت انجام شد', 'موفق');
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              'خطا در تغییر  پسورد حساب کاربری'
            );
          }
          return ret;
        }
      })
    );
  }
}

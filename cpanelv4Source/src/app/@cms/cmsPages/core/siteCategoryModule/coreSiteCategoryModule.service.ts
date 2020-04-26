import { Injectable, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { cmsServerConfig } from 'app/@cms/cmsCommon/environments/cmsServerConfig';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../cmsStore';
import { Subscription, Observable } from 'rxjs';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import {
  FilterModel,
  FilterDataModel,
} from 'app/@cms/cmsModels/base/filterModel';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteCategoryModuleService implements OnDestroy {
  subManager = new Subscription();
  private baseUrl = cmsServerConfig.configApiServerPath + 'CoreSiteCategoryCmsModule/';
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>,
    private publicHelper: PublicHelper
  ) {}
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ServiceCoreSiteCategoryCmsModuleGetAll(model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    
    return this.http.post(this.baseUrl + 'getAll', model, { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success('دسته بندی سایت های دریافت شد', 'موفق');
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              'خطا دریافت دستبندی سایتها'
            );
          }
          return ret;
        }
      })
    );
  }

}

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
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { CmsAuthService } from '../auth/auth.service';
import { ResponseServerHelper } from 'app/@cms/cmsCommon/helper/responseServerHelper';

@Injectable({
  providedIn: 'root',
})
export class CoreSiteService implements OnDestroy {
  subManager = new Subscription();
  private baseUrl = cmsServerConfig.configApiServerPath + 'CoreSite/';
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>,
    private cmsAuthService: CmsAuthService
  ) {
    
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  getAll(model: FilterModel) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + 'getAllwithalias', model, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          if (ret) {
            if (ret.IsSuccess) {
              this.alertService.success(
                'تغییر پسورد با موفقیت انجام شد',
                'موفق'
              );
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
  SelectSite(model: AuthRenewTokenModel) {
    return this.cmsAuthService.RenewToken(model);
  }
}

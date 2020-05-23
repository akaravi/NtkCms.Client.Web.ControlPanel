import { Injectable } from '@angular/core';
import { ErrorExcptionResultBase } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { toArray } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import { CmsAuthService } from 'app/@cms/cmsService/core/auth.service';
import { TokenInfoModel } from 'app/@cms/cmsModels/base/tokenInfoModel';

@Injectable({
  providedIn: 'root',
})
export class PublicHelper {
  TokenInfo: TokenInfoModel;
  constructor(private router: Router, private alertService: ToastrService,cmsAuthService: CmsAuthService) {
    cmsAuthService.CorrectTokenInfoObs.subscribe((vlaue) => {
      this.TokenInfo = vlaue;
    });

  }

  CheckToken() {
    const token = localStorage.getItem('token');

    if (!token || token === 'null') {
      this.alertService.warning(
        'لطفا مجددا وارد حساب کاربری خود شوید',
        'نیاز به ورود مجدد'
      );
      this.router.navigate([environment.cmsUiConfig.Pathlogin]);

    }
    return token;
  }
  CheckTokenInfo() {
    const token = localStorage.getItem('token');

    if (!token || token === 'null') {
      this.alertService.warning(
        'لطفا مجددا وارد حساب کاربری خود شوید',
        'نیاز به ورود مجدد'
      );
      this.router.navigate([environment.cmsUiConfig.Pathlogin]);

    }
    return this.TokenInfo;
  }
  CheckError(model: any) {
    if (!model) {
      return 'Error';
    }
    let errorExcptionResult: ErrorExcptionResultBase;
    if (model['error']) {
      errorExcptionResult = model['error'];
      if (errorExcptionResult) {
        if (errorExcptionResult.Status == 401) {
          this.alertService.warning(
            'لطفا مجددا وارد حساب کاربری خود شوید',
            'نیاز به ورود مجدد'
          );
          this.router.navigate([environment.cmsUiConfig.Pathlogin]);
          return;
        }
      }
    }

    if (model.errors) {
      let ret = '';

      var aaa = model.errors.keys;

      return ret;
    } else if (model && model.ErrorMessage) {
      return model.ErrorMessage;
    }
    return 'Error';
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { cmsServerConfig } from 'environments/environment';

@Injectable()
export class CoreEnumService implements OnDestroy {
  subManager = new Subscription();
  baseUrl = cmsServerConfig.configApiServerPath + 'CoreEnum/';

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
   
    private publicHelper: PublicHelper
  ) {
   
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  
  ServiceEnumRecordStatus() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'EnumRecordStatus', { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumLocationType() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'EnumLocationType', { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumUserLanguage() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'EnumUserLanguage', { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumGender() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'EnumGender', { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumMenuPlaceType() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http.get(this.baseUrl + 'EnumMenuPlaceType', { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }

}

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { cmsServerConfig } from 'environments/environment';
import { MenuPlaceType } from 'app/@cms/cmsModels/Enums/menuPlaceType.enum';

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
  getHeaders() {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };  
    return headers;
  }
  ServiceEnumRecordStatus<TOut>() {
 
    return this.http.get(this.baseUrl + 'EnumRecordStatus', { headers: this.getHeaders() }).pipe(
      map((ret: ErrorExcptionResult<TOut>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumLocationType<TOut>() {
 
    return this.http.get(this.baseUrl + 'EnumLocationType', { headers: this.getHeaders() }).pipe(
      map((ret: ErrorExcptionResult<TOut>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumUserLanguage<TOut>() {
 
    return this.http.get(this.baseUrl + 'EnumUserLanguage', { headers: this.getHeaders() }).pipe(
      map((ret: ErrorExcptionResult<TOut>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumGender<TOut>() {
 
    return this.http.get(this.baseUrl + 'EnumGender', { headers: this.getHeaders() }).pipe(
      map((ret: ErrorExcptionResult<TOut>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }
  ServiceEnumMenuPlaceType() {
 
    return this.http.get(this.baseUrl + 'EnumMenuPlaceType', { headers: this.getHeaders() }).pipe(
      map((ret: ErrorExcptionResult<MenuPlaceType>) => {
        if (ret) {
          return ret;
        }
      })
    );
  }

}

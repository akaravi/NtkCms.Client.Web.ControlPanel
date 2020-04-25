import { Injectable, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { cmsServerConfig } from "app/@cms/cmsCommon/environments/cmsServerConfig";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromStore from "../../../cmsStore";
import { Subscription, Observable } from "rxjs";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import {
  FilterModel,
  FilterDataModel,
} from "app/@cms/cmsModels/base/filterModel";
import { AuthRenewTokenModel } from "app/@cms/cmsModels/core/authModel";
import { CmsAuthService } from "../auth/auth.service";
import { ResponseServerHelper } from "app/@cms/cmsCommon/helper/responseServerHelper";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";

@Injectable({
  providedIn: "root",
})
export class CoreSiteCategoryService implements OnDestroy {
  subManager = new Subscription();
  private baseUrl = cmsServerConfig.configApiServerPath + "CoreSiteCategory/";
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router: Router,
    private store: Store<fromStore.State>,
    private cmsAuthService: CmsAuthService,
    private publicHelper: PublicHelper
  ) {}
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  ServiceCoreSiteCategoryGetAll(model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    return this.http
      .post(this.baseUrl + "getAll", model, { headers: headers })
      .pipe(
        map((ret: ErrorExcptionResult<any>) => {
          if (ret) {
            if (ret.IsSuccess) {
              this.alertService.success("دسته بندی سایت های دریافت شد", "موفق");
            } else {
              this.alertService.error(
                ret.ErrorMessage,
                "خطا دریافت دستبندی سایتها"
              );
            }
            return ret;
          }
        })
      );
  }
  // بعدا به ماژول خودش منتقل کنید
  ServiceCoreSiteCategoryCmsModuleGetAll(model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    let urlStr =
      cmsServerConfig.configApiServerPath + "CoreSiteCategoryCmsModule/";
    return this.http.post(urlStr + "getAll", model, { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          if (ret.IsSuccess) {
            let filterModelCategory: FilterModel;
            filterModelCategory = new FilterModel();
            let filterDataModel: FilterDataModel;
            filterDataModel = new FilterDataModel();
            ret.ListItems.forEach((element) => {
              filterDataModel.IntContainValues.push(element["LinkCmsModuleId"]);
            });

            filterDataModel.PropertyName = "Id";
            filterModelCategory.Filters.push(filterDataModel);

            //Observable
            // return this.http.post(urlStr + 'getAll', model, { headers: headers }).map((response: Response) =>{
            //              return Response;
            //               });

            const retOut = this.ServiceCoreModuleGetAll(filterModelCategory).subscribe(
              (next) => {
                return next;
              }
            );
            
            //.subscribe((next) => {return next },(error) => {});

            // return this.ServiceCoreModuleGetAll(filterModelCategory).pipe(
            //   map((ret2: ErrorExcptionResult<any>) => {

            //     return ret2;
            //   }));

            //  this.ServiceCoreModuleGetAll(filterModelCategory).(
            //   map((ret2: ErrorExcptionResult<any>) => {
            //     return ret2;
            //   }));

            //return ret;
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              "خطا دریافت دستبندی سایتها"
            );
          }
          return ret;
        }
      })
    );
  }
  // بعدا به ماژول خودش منتقل کنید
  ServiceCoreModuleGetAll(model: FilterModel) {
    const token = this.publicHelper.CheckToken();
    const headers = { Authorization: token };
    let urlStr = cmsServerConfig.configApiServerPath + "CoreModule/";
    return this.http.post(urlStr + "getAll", model, { headers: headers }).pipe(
      map((ret: ErrorExcptionResult<any>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.alertService.success("دسته بندی سایت های دریافت شد", "موفق");
          } else {
            this.alertService.error(
              ret.ErrorMessage,
              "خطا دریافت دستبندی سایتها"
            );
          }
          return ret;
        }
      })
    );
  }
  ServiceCoreSiteSelectSite(model: AuthRenewTokenModel) {
    return this.cmsAuthService.RenewToken(model);
  }
}

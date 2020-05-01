import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoreSiteCategoryService } from '../../../../cmsService/core/coreSiteCategory.service';
import {
  FilterModel,
  FilterDataModel,
} from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { ToastrService } from 'ngx-toastr';
import { CoreSiteCategoryModuleService } from '../../../../cmsService/core/coreSiteCategoryModule.service';
import { CoreModuleService } from '../../../../cmsService/core/coreModule.service';

@Component({
  selector: 'app-core-site-category-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class CoreSiteCategorySelectComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModelCategory: ErrorExcptionResult<any>;
  dataModelModule: ErrorExcptionResult<any>;
  dataModelLoad = false;
  dataSelectedSiteCategory: any = {};
  model: any = {};

  constructor(
    private coreSiteCategoryService: CoreSiteCategoryService,
    private coreSiteCategoryModuleService: CoreSiteCategoryModuleService,
    private coreModuleService: CoreModuleService,

    private alertService: ToastrService,
    private publicHelper: PublicHelper
  ) {
   
  }

  ngOnInit() {
    this.CoreSiteCategoryGetAll();
  }

  CoreSiteCategoryGetAll() {
    this.subManager.add(
      this.coreSiteCategoryService
        .ServiceGetAll(this.filteModel)
        .subscribe(
          (next) => {
            if (next.IsSuccess) {
              this.dataModelCategory = next;
              this.dataModelLoad = true;
              this.alertService.info('اطلاعات دریافت شد', 'توجه');
            }
          },
          (error) => {
            this.alertService.error(
              this.publicHelper.CheckError(error),
              'خطا در دریافت اطلاعات وب سایتها'
            );
          }
        )
    );
  }
  trackByFn() {}
  clickSelectSiteCategory(model) {
    let filterModelCategory: FilterModel;
    filterModelCategory = new FilterModel();
    let filterDataModel: FilterDataModel;
    filterDataModel = new FilterDataModel();
    filterDataModel.IntValue1 = model['Id'];
    filterDataModel.PropertyName = 'LinkCmsSiteCategoryId';
    filterModelCategory.Filters.push(filterDataModel);

    this.dataSelectedSiteCategory = model;
    this.dataModelModule = new ErrorExcptionResult<any>();
    this.subManager.add(
      this.coreSiteCategoryModuleService
        .ServiceGetAll(filterModelCategory)
        .subscribe(
          (next) => {
            if (next.IsSuccess) {
              let filterModelCategory2: FilterModel;
              filterModelCategory2 = new FilterModel();
              let filterDataModel2: FilterDataModel;
              filterDataModel2 = new FilterDataModel();
              next.ListItems.forEach((element) => {
                filterDataModel2.IntContainValues.push(
                  element['LinkCmsModuleId']
                );
              });

              filterDataModel2.PropertyName = 'Id';
              filterModelCategory2.Filters.push(filterDataModel2);
              this.coreModuleService
                .ServiceGetAll(filterModelCategory2)
                .subscribe(
                  (next2) => {
                    if (next2.IsSuccess) {
                      this.dataModelModule = next2;
                      this.dataModelLoad = true;
                      this.alertService.info('اطلاعات دریافت شد', 'توجه');
                    }
                  },
                  (error2) => {
                    this.alertService.error(
                      this.publicHelper.CheckError(error2),
                      'خطا در دریافت اطلاعات وب سایتها'
                    );
                  }
                );
            }
          },
          (error) => {
            this.alertService.error(
              this.publicHelper.CheckError(error),
              'خطا در دریافت اطلاعات وب سایتها'
            );
          }
        )
    );
  }
}


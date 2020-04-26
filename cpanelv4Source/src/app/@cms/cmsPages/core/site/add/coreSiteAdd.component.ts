import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { FilterModel, FilterDataModel } from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { ToastrService } from "ngx-toastr";
import { CoreSiteService } from "../coreSite.service";
import { CoreSiteCategoryModuleService } from '../../siteCategoryModule/coreSiteCategoryModule.service';
import { CoreModuleService } from '../../module/coreModule.service';
import { CoreSiteCategoryService } from '../../siteCategory/coreSiteCategory.service';

@Component({
  selector: "app-cms-site-add",
  templateUrl: "./coreSiteAdd.component.html",
  styleUrls: ["./coreSiteAdd.component.scss"],
})
export class CoreSiteAddComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModel: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  //dataModelDomains: Array<string> ;//=  {'oco.ir','qwp.ir'};
  dataModelLoad = false;
  model: any = {};
  dataModelDomains = [{ Title: "", Domain: "" }];
  dataSelectedSiteCategory: any = {};
  dataModelModule: ErrorExcptionResult<any>;
  dataModelCategory: ErrorExcptionResult<any>;

  selectedDomain: any;


  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private coreSiteCategoryModuleService: CoreSiteCategoryModuleService,
    private coreModuleService: CoreModuleService,
    private coreSiteCategoryService: CoreSiteCategoryService,

  ) {}

  ngOnInit() {
    this.GetModelInfo();
    this.GetDomainList();
  }
  GetDomainList() {
    this.coreSiteService.ServiceDomains(0).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelDomains = next.ListItems;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "خطا در دریافت لیست دامنه های قابل استفاده"
        );
      }
    );
  }
  GetModelInfo() {
    this.coreSiteService.ServiceViewModel().subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModel = next;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "خطا در دریافت مدل"
        );
      }
    );
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
                .ServiceCoreModuleGetAll(filterModelCategory2)
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

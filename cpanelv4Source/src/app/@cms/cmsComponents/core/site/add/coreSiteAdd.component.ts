import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  FilterModel,
  FilterDataModel,
} from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { ToastrService } from "ngx-toastr";
import { CoreSiteService } from "../../../../cmsService/core/coreSite.service";
import { CoreSiteCategoryModuleService } from "../../../../cmsService/core/coreSiteCategoryModule.service";
import { CoreModuleService } from "../../../../cmsService/core/coreModule.service";
import { CoreSiteCategoryService } from "../../../../cmsService/core/coreSiteCategory.service";

@Component({
  selector: "app-cms-site-add",
  templateUrl: "./coreSiteAdd.component.html",
  styleUrls: ["./coreSiteAdd.component.scss"],
})
export class CoreSiteAddComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModel: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  dataModelLoad = false;
  dataModelDomains = [{ Title: "", Domain: "" }];
  dataModelModule: ErrorExcptionResult<any>;
  dataModelCategory: ErrorExcptionResult<any>;

  selectedDomain: any;

  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private coreSiteCategoryModuleService: CoreSiteCategoryModuleService,
    private coreModuleService: CoreModuleService,
    private coreSiteCategoryService: CoreSiteCategoryService
  ) {}

  private dateModleInput: any;

  @Input()
  set dateInput(model: any) {
    this.dateModleInput = model;
  }
  get dateInput(): any {
    return this.dateModleInput;
  }

  ngOnInit() {
    this.GetModelInfo();
    this.GetDomainList();
    this.CoreSiteCategoryGetAll();
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
      this.coreSiteCategoryService.ServiceGetAll(this.filteModel).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.dataModelCategory = next;
            this.dataModelLoad = true;
            this.alertService.info("اطلاعات دریافت شد", "توجه");
          }
        },
        (error) => {
          this.alertService.error(
            this.publicHelper.CheckError(error),
            "خطا در دریافت اطلاعات وب سایتها"
          );
        }
      )
    );
  }
  clickSelectSiteCategory(Id: number) {
    let filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 50;

    this.dataModelModule = new ErrorExcptionResult<any>();
    this.subManager.add(
      this.coreModuleService
        .ServiceGetAllByCategorySiteId(Id, filterModel)
        .subscribe(
          (next2) => {
            if (next2.IsSuccess) {
              this.dataModelModule = next2;
              this.dataModelLoad = true;
              this.alertService.info("اطلاعات دریافت شد", "توجه");
            }
          },
          (error2) => {
            this.alertService.error(
              this.publicHelper.CheckError(error2),
              "خطا در دریافت اطلاعات وب سایتها"
            );
          }
        )
    );
  }
  onSubmit() {
    let AddFirstSite = false;
    if (this.dateModleInput && this.dateModleInput.AddFirstSite)
      AddFirstSite = true;
    if (AddFirstSite) {
      this.subManager.add(
        this.coreSiteService.ServiceAddFirstSite(this.dataModel.Item).subscribe(
          (next) => {
            if (next.IsSuccess) {
            }
          },
          (error) => {
            this.alertService.error(
              this.publicHelper.CheckError(error),
              "خطا در ساخت وب سایت"
            );
          }
        )
      );
    } else {
      this.subManager.add(
        this.coreSiteService.ServiceAdd(this.dataModel.Item).subscribe(
          (next) => {
            if (next.IsSuccess) {
            }
          },
          (error) => {
            this.alertService.error(
              this.publicHelper.CheckError(error),
              "خطا در ساخت وب سایت"
            );
          }
        )
      );
    }
  }
}

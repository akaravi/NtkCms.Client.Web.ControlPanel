import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CoreSiteCategoryService } from '../../siteCategory/coreSiteCategory.service';
import { FilterModel, FilterDataModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-core-site-category-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class CoreSiteCategorySelectComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModelCategory: ErrorExcptionResult<any>;
  dataModelModule: ErrorExcptionResult<any>;
  dataModelLoad = false;
  dataSelectedSiteCategory: any = {};
  model: any = {};

  constructor(private coreSiteCategoryService: CoreSiteCategoryService,
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    ) { }

  ngOnInit() {
  this.CoreSiteCategoryGetAll()
  }
  
  CoreSiteCategoryGetAll(){
    this.subManager.add(
      this.coreSiteCategoryService.ServiceCoreSiteCategoryGetAll(this.filteModel).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.dataModelCategory = next;
            this.dataModelLoad = true;
            this.alertService.info('اطلاعات دریافت شد', 'توجه');
          }
        },
        (error) => {
          this.alertService.error( this.publicHelper.CheckError(error), 'خطا در دریافت اطلاعات وب سایتها' );
        }
      )
    );
  }
  trackByFn(){

  }
  clickSelectSiteCategory(model)
  {
    let filterModelCategory: FilterModel;
    filterModelCategory = new FilterModel;
    let filterDataModel: FilterDataModel;
    filterDataModel = new FilterDataModel;
    filterDataModel.IntValue1 = model['Id'];
    filterDataModel.PropertyName = 'LinkCmsSiteCategoryId';
    filterModelCategory.Filters.push(filterDataModel);

    this.dataSelectedSiteCategory = model;
    this.subManager.add(
      this.coreSiteCategoryService.ServiceCoreSiteCategoryCmsModuleGetAll(filterModelCategory).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.dataModelModule = next;
            this.dataModelLoad = true;
            this.alertService.info('اطلاعات دریافت شد', 'توجه');
          }
        },
        (error) => {
          this.alertService.error( this.publicHelper.CheckError(error), 'خطا در دریافت اطلاعات وب سایتها' );
        }
      )
    );
  }
}

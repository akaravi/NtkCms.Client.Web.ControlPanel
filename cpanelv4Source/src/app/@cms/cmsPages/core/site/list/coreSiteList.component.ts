import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { CoreSiteService } from '../coreSite.service';
import { CoreSiteCategoryModuleService } from '../../siteCategoryModule/coreSiteCategoryModule.service';
import { CoreModuleService } from '../../module/coreModule.service';
import { CoreSiteCategoryService } from '../../siteCategory/coreSiteCategory.service';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";



declare var require: any;
//const data: any = require('../../../../shared/data/company.json');
const data: any = require('../../../../../shared/data/company.json');

@Component({
  selector: 'app-cms-site-list',
  templateUrl: './coreSiteList.component.html',
  styleUrls: ['./coreSiteList.component.scss']
})
export class CoreSiteListComponent implements OnInit {
  rows = [];

  temp = [];

  // Table Column Titles
  columns = [
      { prop: 'name' },
      { name: 'Company' },
      { name: 'Gender' }
  ];
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;

  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private coreSiteCategoryModuleService: CoreSiteCategoryModuleService,
    private coreModuleService: CoreModuleService,
    private coreSiteCategoryService: CoreSiteCategoryService
  ) {
    this.temp = [...data];
    this.rows = data;

   }
  filteModel = new FilterModel();
  dataModelSite: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();

  ngOnInit() {
    this.coreSiteCategoryService.ServiceConstructor();
    this.coreSiteService.ServiceConstructor();
    this.GetSiteList();
  }
  GetSiteList() {
    this.coreSiteService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelSite = next;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          'برروی خطا در دریافت اطلاعات'
        );
      }
    );
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
}
}


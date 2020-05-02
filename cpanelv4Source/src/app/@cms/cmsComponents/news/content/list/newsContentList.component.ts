import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { NewsContentService } from 'app/@cms/cmsService/news/newsContent.service';
import { NewsCategoryService } from 'app/@cms/cmsService/news/newsCategory.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-news-content-List',
  templateUrl: './newsContentList.component.html',
  styleUrls: ['./newsContentList.component.scss']
})
export class NewsContentListComponent implements OnInit {
  filteModelConetnt = new FilterModel();
  filteModelCategory = new FilterModel();
  dataModelConetnt: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  dataModelCategory: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
 // Table Column Titles
 columnsConetnt = [
  {
    prop: "Title",
  },
  {
    name: "Domain",
  },
  {
    name: "SubDomain",
  },
];
 columnsCategory = [
  {
    prop: "Title",
  },
  {
    name: "Domain",
  },
  {
    name: "SubDomain",
  },
];
@ViewChild(DatatableComponent, {  static: false,})
tableConetnt: DatatableComponent;
tableCategory: DatatableComponent;

  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private newsContentService: NewsContentService,
    private newsCategoryService: NewsCategoryService,
  ) {}

  ngOnInit() {
    this.DataGetAllConetnt();
    this.DataGetAllCategory();
  }
  DataGetAllConetnt() {
    this.newsContentService.ServiceGetAll(this.filteModelConetnt).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelConetnt = next;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "برروی خطا در دریافت اطلاعات"
        );
      }
    );
  }
  DataGetAllCategory() {
    this.newsCategoryService.ServiceGetAll(this.filteModelCategory).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelCategory = next;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "برروی خطا در دریافت اطلاعات"
        );
      }
    );
  }
  onActionCategorySelect(event: any)
  {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
    } else {
      row.treeStatus = 'collapsed';
    }
    //this.rows = [...this.rows];
  }
}

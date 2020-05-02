import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  FilterModel,
  FilterDataModel,
} from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { ToastrService } from "ngx-toastr";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { NewsContentService } from "app/@cms/cmsService/news/newsContent.service";
import { NewsCategoryService } from "app/@cms/cmsService/news/newsCategory.service";
import {
  DatatableComponent,
  ColumnMode,
  TableColumn,
  SelectionType,
} from "@swimlane/ngx-datatable";
import {
  TREE_ACTIONS,
  KEYS,
  IActionMapping,
  ITreeOptions,
} from "angular-tree-component";
import { SortType } from "app/@cms/cmsModels/Enums/sortType.enum";
import { PersianCalendarService } from 'app/@cms/cmsCommon/pipe/PersianDatePipe/persian-date.service';

@Component({
  selector: "app-news-content-List",
  templateUrl: "./newsContentList.component.html",
  styleUrls: ["./newsContentList.component.scss"],
})
export class NewsContentListComponent implements OnInit {
  filteModelConetnt = new FilterModel();
  filteModelCategory = new FilterModel();
  dataModelConetnt: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  dataModelCategory: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  // Table Column Titles
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  tableContentloading = false;
  tableContentSelected: Array<any> = [];
  columnsConetnt: TableColumn[] = [
    {
      prop: "Id",
      name: "شناسه",
    },
    {
      prop: "CreatedDate",
      name: "ساخت",
      pipe:{transform: this.LocaleDate}
    },
    {
      prop: "UpdatedDate",
      name: "ویرایش",
      pipe:{transform: this.LocaleDate}
    },
    {
      prop: "Title",
      name: "عنوان",
    },
    {
      prop: "Description",
      name: "توضیحات",
    },
  ];

  optionsModelTree: ITreeOptions = {
    idField: "id",
    displayField: "Title",
    childrenField: "Children",
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren)
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        },
        click: (tree, node, $event) => {
          this.onActionCategorySelect(node);
        },
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        },
      },
    },
    //nodeHeight: 23,
    allowDrag: (node) => {
      return false;
    },
    allowDrop: (node) => {
      return false;
    },
    allowDragoverStyling: true,
    levelPadding: 10,
    //useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    //scrollContainer: document.documentElement, // HTML
    rtl: true,
  };
  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private newsContentService: NewsContentService,
    private newsCategoryService: NewsCategoryService,
  ) {}
  LocaleDate(model)
{
  const d = new Date(model);
  return d.toLocaleDateString('fa-Ir');
}
  ngOnInit() {
    this.DataGetAllConetnt();
    this.DataGetAllCategory();
  }

  DataGetAllConetnt() {
    this.tableContentSelected = [];
    this.tableContentloading = true;
    this.newsContentService.ServiceGetAll(this.filteModelConetnt).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelConetnt = next;
          this.tableContentloading = false;
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "برروی خطا در دریافت اطلاعات"
        );
        this.tableContentloading = false;
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
  onActionCategorySelect(model: any) {
    this.filteModelConetnt = new FilterModel();
    if (model && model.data) {
      var aaa = {
        PropertyName: "LinkCategoryId",
        IntValue1: model.data.Id,
      };
      this.filteModelConetnt.Filters.push(aaa as FilterDataModel);
    }
    this.DataGetAllConetnt();
  }
  onActionSetPage(model: any) {
    this.filteModelConetnt.CurrentPageNumber = model.offset + 1;
    this.DataGetAllConetnt();
  }
  onActionSort(event) {
    const sort = event.sorts[0];

    if (sort) {
      if (sort.dir === "desc") {
        this.filteModelConetnt.SortType = SortType.Descending;
      } else {
        this.filteModelConetnt.SortType = SortType.Ascending;
      }
      this.filteModelConetnt.SortColumn = sort.prop;
    }
    this.DataGetAllConetnt();
  }
  onActionSelect(event) {
    //your code here
    console.log("onActionSelect Event", event);
    console.log("tableContentSelected Event", this.tableContentSelected);
  }
  onActionbuttonNewEntity() {}
  onActionbuttonEditRow() {}
  onActionbuttonDeleteRow() {}
  onActionbuttonStatus() {}
  onActionbuttonExport() {}

  onActionbuttonReload() {
    this.DataGetAllConetnt();
    this.DataGetAllCategory();
  }
}

import { Component, OnInit, Input } from "@angular/core";
import {
  FilterModel,
  FilterDataModel,
} from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { TREE_ACTIONS, ITreeOptions, KEYS } from "angular-tree-component";
import { ToastrService } from "ngx-toastr";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { NewsContentService } from "app/@cms/cmsService/news/newsContent.service";
import { NewsCategoryService } from "app/@cms/cmsService/news/newsCategory.service";

@Component({
  selector: "app-news-category-select",
  templateUrl: "./categorySelect.component.html",
  styleUrls: ["./categorySelect.component.scss"],
})
export class NewsCategorySelectComponent implements OnInit {
  @Input()
  set options(model: any) {
    this.dateModleInput = model;
  }
  get options(): any {
    return this.dateModleInput;
  }
  private dateModleInput: any;

  filteModelCategory = new FilterModel();
  dataModelCategory: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
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
          this.onActionSelect(node);
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
    private categoryService: NewsCategoryService
  ) {}

  ngOnInit() {
    this.DataGetAllCategory();
  }
  DataGetAllCategory() {
    this.filteModelCategory.RowPerPage = 200;
    this.categoryService.ServiceGetAll(this.filteModelCategory).subscribe(
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
  onActionSelect(model: any) {
    if (this.dateModleInput && this.dateModleInput.onActionSelect) {
      this.dateModleInput.onActionSelect(model);
    }
    // this.filteModelConetnt = new FilterModel();
    // if (model && model.data) {
    //   var aaa = {
    //     PropertyName: "LinkCategoryId",
    //     IntValue1: model.data.Id,
    //   };
    //   this.filteModelConetnt.Filters.push(aaa as FilterDataModel);
    // }
    // this.DataGetAllConetnt();
  }
}

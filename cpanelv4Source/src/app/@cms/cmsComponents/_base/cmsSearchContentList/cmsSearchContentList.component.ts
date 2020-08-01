import {  Component,  ViewChild,  OnInit,  OnDestroy,  Input,  Injectable,} from "@angular/core";
import { FilterDataModel } from "app/@cms/cmsModels/base/filterModel";
import { ResultAccessModel } from "app/@cms/cmsModels/base/errorExcptionResult";
import { RuleSet, QueryBuilderFieldMap, Field, Rule } from "ngx-query-builder";
import { ClauseType } from "app/@cms/cmsModels/Enums/clauseType.enum";

@Component({
  selector: "app-cms-search-content-list",
  templateUrl: "./cmsSearchContentList.component.html",
  styleUrls: ["./cmsSearchContentList.component.scss"],
})
export class CmsSearchContentListComponent implements OnInit {
  optionsData: any;

  Filters: Array<FilterDataModel>;
  @Input()
  set options(model: any) {
    this.optionsData = model;
    model.setResultAccess = (x) => this.setResultAccess(x);
  }
  get options(): any {
    return this.optionsData;
  }
  model: any;
  query: RuleSet;
  // {
  //condition: 'and',
  // rules: [
  //   {
  //     field: 'category',
  //     type: 'select',
  //     operator: 'equal',
  //     value: ['wallets']
  //   },
  //   {
  //     field: 'price',
  //     type: 'double',
  //     operator: 'greater',
  //     value: 45.5
  //   },
  //   {
  //     field: 'inStock',
  //     type: 'boolean',
  //     operator: 'equal',
  //     value: true
  //   },
  //   {
  //     field: 'createdOn',
  //     type: 'date',
  //     operator: 'equal',
  //     value: '2020-01-20'
  //   }
  //   ]
  //};

  fieldMap: QueryBuilderFieldMap = {};

  constructor() {}

  ngOnInit() {}
  setResultAccess(model: ResultAccessModel) {
    this.optionsData.resultAccess = model;
    this.setFields();
  }
  setFields() {
    if (
      this.optionsData &&
      this.optionsData.resultAccess &&
      this.optionsData.resultAccess.FieldsInfo 
    ) {
      this.optionsData.resultAccess.FieldsInfo.forEach((column, index) => {
        if (!column.AccessSearchField)
          return;
        if (
          column.FieldType === "System.Int32" ||
          column.FieldType === "System.Int64"
        ) {
          this.fieldMap[column.FieldName] = {
            name: column.FieldTitle,
            type: "integer",
          };
        } else if (column.FieldType === "System.String") {
          this.fieldMap[column.FieldName] = {
            name: column.FieldTitle,
            type: "string",
          };
        } else if (column.FieldType === "MongoDB.Bson.ObjectId") {
          this.fieldMap[column.FieldName] = {
            name: column.FieldName,
            type: "string",
          };
        } else if (column.FieldType === "System.Boolean") {
          this.fieldMap[column.FieldName] = {
            name: column.FieldTitle,
            type: "select",

            options: [
              { name: "بله", value: true },
              { name: "خیر", value: false },
            ],
          };
        } else if (column.FieldType === "System.DateTime") {
          this.fieldMap[column.FieldName] = {
            name: column.FieldTitle,
            type: "date",
            settings: {},
          };
        } else if (column.FieldType === "link") {
          this.fieldMap[column.FieldName] = {
            name: column.FieldTitle,
            type: "string",
          };
        } else {
          //console.log("Error: Type is not defined for columns! Please add 'type' property for each columns in gridOptions.");
        }
      });
    }
  }
  getRules() {
    this.Filters = new Array<FilterDataModel>();
    var clauseType: ClauseType = ClauseType.And;
    if (!this.query || !this.query .condition)
      return;
      
    if (this.query.condition == "or") clauseType = ClauseType.Or;
    this.query.rules.forEach((column, index) => {
      var ruleSet = column as RuleSet;
      var rule = column as Rule;
      if (
        ruleSet &&
        ruleSet.condition &&
        ruleSet.rules &&
        ruleSet.rules.length > 0
      ) {
        var Filter=new FilterDataModel();
        Filter.Filters =this.getRulesSetChild(ruleSet);
        Filter.ClauseType = clauseType;
        this.Filters.push(Filter);
      } else if (rule) {
        var Filter = this.getRulesChild(rule);
        Filter.ClauseType = clauseType;
        this.Filters.push(Filter);
      }
    });

    
  }
  getRulesChild(rule: Rule): FilterDataModel {
    var searchType = this.getSearchType(rule.operator);
    var Filter = new FilterDataModel();
    Filter.PropertyName = rule.field;
    Filter.value = rule.value;
    Filter.SearchType = searchType;
    return Filter;
  }
  getRulesSetChild(ruleSetInput: RuleSet): Array<FilterDataModel> {
    var Filters = new Array<FilterDataModel>();
    var clauseType: ClauseType = ClauseType.And;
    if (ruleSetInput.condition == "or") clauseType = ClauseType.Or;
    ruleSetInput.rules.forEach((column, index) => {
      var ruleSet = column as RuleSet;
      var rule = column as Rule;
      if (
        ruleSet &&
        ruleSet.condition &&
        ruleSet.rules &&
        ruleSet.rules.length > 0
      ) {
        var Filter=new FilterDataModel();
        Filter.Filters =this.getRulesSetChild(ruleSet);
        Filter.ClauseType = clauseType;
        Filters.push(Filter);
      } else if (rule) {
        var Filter = this.getRulesChild(rule);
        Filter.ClauseType = clauseType;
        Filters.push(Filter);
      }
    });
    return Filters;
  }
  
  onSubmit() {
    //this.model = { name: "ali" };
    this.getRules();
    this.optionsData.onSubmit(this.Filters);
  }
  onGetRules() {
    console.log(this.query);
  }
  onSaveRules() {}
  onSetRules() {}
  getSearchType(operator) {
    switch (operator) {
      case "equal":
        return 0;
      case "not_equal":
        return 1;
      case "less":
        return 2;
      case "greater":
        return 3;
      case "between":
        return 4;
      case "contains":
        return 5;
      case "not_contains":
        return 6;
      case "begins_with":
        return 7;
      case "ends_with":
        return 8;
      case "less_or_equal":
        return 9;
      case "greater_or_equal":
        return 10;
    }
  }
}

import { Component, ViewChild, OnInit, OnDestroy, Input, Injectable } from '@angular/core';
import { FilterDataModel } from "app/@cms/cmsModels/base/filterModel";
import { ResultAccessModel } from "app/@cms/cmsModels/base/errorExcptionResult";
import {QueryBuilderFieldMap, RuleSet} from 'ngx-query-builder';

@Component({
  selector: 'app-cms-search-content-list',
  templateUrl: './cmsSearchContentList.component.html',
  styleUrls: ['./cmsSearchContentList.component.scss']
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
  query: RuleSet = {
    condition: 'and',
    rules: [
      {
        field: 'category',
        type: 'select',
        operator: 'equal',
        value: ['wallets']
      },
      {
        field: 'price',
        type: 'double',
        operator: 'greater',
        value: 45.5
      },
      {
        field: 'inStock',
        type: 'boolean',
        operator: 'equal',
        value: true
      },
      {
        field: 'createdOn',
        type: 'date',
        operator: 'equal',
        value: '2020-01-20'
      }
    ]
  };
 
  fieldMap: QueryBuilderFieldMap = {
    name: {
      name: 'Name',
      type: 'string',
      settings: {
        nullableOperators: true,
        emptyOperators: true
      }
    },
    price: {
      name: 'Price',
      type: 'double'
    },
    createdOn: {
      name: 'Created On',
      type: 'date'
    },
    inStock: {
      name: 'In Stock',
      type: 'boolean'
    },
    category: {
      name: 'Category',
      type: 'select',
      options: [
        {name: 'Jackets', value: 'jackets'},
        {name: 'Hats', value: 'hats'},
        {name: 'Sandals', value: 'sandals'},
        {name: 'Wallets', value: 'wallets'},
        {name: 'Belts', value: 'belts'},
        {name: 'T-Shirts', value: 't-shirts'},
        {name: 'Toys', value: 'toys'},
        {name: 'Jumpers', value: 'jumpers'},
        {name: 'Jewellery', value: 'jewellery'},
      ]
    }
  };
  constructor() {}

  ngOnInit() {}
  setResultAccess(model: ResultAccessModel) {
    this.optionsData.resultAccess = model;
    this.setFields();


    
  }
  setFields() {
    var fields = [];
    if (
      this.optionsData &&
      this.optionsData.resultAccess &&
      this.optionsData.resultAccess.FieldsInfo &&
      this.optionsData.resultAccess.AccessSearchField
    ) {
      this.optionsData.resultAccess.FieldsInfo.forEach((column, index) => {
        if (
          this.optionsData.resultAccess.AccessSearchField.indexOf(
            column.FieldName
          ) < 0
        )
          return;
        if (
          column.FieldType === "System.Int32" ||
          column.FieldType === "System.Int64"
        ) {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "integer",
            operators: [
              "equal",
              "not_equal",
              "less",
              "greater",
              "between",
              "less_or_equal",
              "greater_or_equal",
            ],
          });
        } else if (column.FieldType === "System.String") {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "string",
            operators: [
              "equal",
              "not_equal",
              "contains",
              "not_contains",
              "begins_with",
              "ends_with",
            ],
          });
        } else if (column.FieldType === "MongoDB.Bson.ObjectId") {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "string",
            typeChild: "ObjectId",
            operators: ["equal", "not_equal"],
          });
        } else if (column.FieldType === "System.Boolean") {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "boolean",
            input: "radio",
            values: {
              True: "بله",
              False: "خیر",
            },
            operators: ["equal"],
          });
        } else if (column.FieldType === "System.DateTime") {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "date",
            operators: [
              "equal",
              "not_equal",
              "less",
              "greater",
              "between",
              "less_or_equal",
              "greater_or_equal",
            ],
            validation: {
              format: "yyyy/0m/dd",
            },
            plugin: "persianDatepicker",
            plugin_config: {
              formatDate: "YYYY/0M/DD",
              theme: "lightorang",
            },
          });
        } else if (column.FieldType === "link") {
          fields.push({
            id: column.FieldName,
            label: column.FieldTitle,
            type: "string",
            operators: [
              "equal",
              "not_equal",
              "contains",
              "begins_with",
              "ends_with",
            ],
          });
        } else {
          //console.log("Error: Type is not defined for columns! Please add 'type' property for each columns in gridOptions.");
        }
      });
    }
  }
  getRules() {
    var result :any;// $(element).queryBuilder("getRules");
    this.Filters = new Array<FilterDataModel>();
    
    if (result) {
      for (var i = 0; i < result.rules.length; i++) {
        var propertyName = result.rules[i].field;
        var searchType = this.getSearchType(result.rules[i].operator);
        var value = result.rules[i].value;
        var clauseType = result.condition == "OR" ? 1 : 2;
        var Filter = new FilterDataModel();

        if (result.rules[i].type == "integer") {
          if (searchType == 4) {
            Filter = new FilterDataModel()
            {
              PropertyName: propertyName;
              IntValue1: value[0];
              IntValue2: value[1];
              SearchType: searchType;
              ClauseType: clauseType;
            }
          } else{
            Filter =new FilterDataModel() 
            {
              PropertyName: propertyName;
              IntValue1: value;
              SearchType: searchType;
              ClauseType: clauseType;
            };
          }
        } else if (
          result.rules[i].type == "string" &&
          result.rules[i].input != "radio"
        ) {
          if (result.rules[i].typeChild == "ObjectId") {
            Filter = new FilterDataModel()
            {
              PropertyName: propertyName;
              ObjectIdValue1Set: value;
              SearchType: searchType;
              ClauseType: clauseType;
            };
          } else {
            if (searchType == 4)
            { 
               Filter = new FilterDataModel()
               {
                PropertyName: propertyName;
                StringValue1: value;
                StringValue2: value;
                SearchType: searchType;
                ClauseType: clauseType;
              };
            }
            else
             { Filter = new FilterDataModel()
              {
                PropertyName: propertyName;
                StringValue1: value;
                SearchType: searchType;
                ClauseType: clauseType;
              };
            }
          }
        } else if (result.rules[i].type == "boolean") {
          // Type is boolean
          if (searchType == 4)
          {  Filter = new FilterDataModel()
            {
              PropertyName: propertyName;
              BooleanValue1: value[0];
              BooleanValue2: value[1];
              SearchType: searchType;
              ClauseType: clauseType;
            };
          }
          else
           { Filter =new FilterDataModel() 
            {
              PropertyName: propertyName;
              BooleanValue1: value;
              SearchType: searchType;
              ClauseType: clauseType;
            };
          }
        } else if (result.rules[i].type == "date") {
          if (searchType == 4)
          {
            Filter = new FilterDataModel()
            {
              PropertyName: propertyName;
              DateTimeValue1: value[0];
              DateTimeValue2: value[1];
              SearchType: searchType;
              ClauseType: clauseType;
            };
          }
          else
          {
            Filter = new FilterDataModel()
            {
              PropertyName: propertyName;
              DateTimeValue1: value;
              SearchType: searchType;
              ClauseType: clauseType;
            };
          }
        }
        this.Filters.push(Filter);
      }
    }
  }
  onSubmit() {
    this.model = { name: "ali" };
    this.optionsData.onSubmit(this.model);
  }
  onGetRules() {}
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

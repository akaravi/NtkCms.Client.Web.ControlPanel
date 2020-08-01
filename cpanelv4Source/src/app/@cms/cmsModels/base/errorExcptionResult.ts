export class ErrorExcptionResultBase {
  Status: number;
  token: string;
  IsSuccess: boolean = false;
  errors: Map<string, Array<string>>;
  ErrorMessage: string;
}
export class ErrorExcptionResult<T> extends ErrorExcptionResultBase {
  ListItems: Array<T>;
  Item: T;
  CurrentPageNumber: number;
  TotalRowCount: number;
  RowPerPage: number;
  resultAccess: ResultAccessModel = new ResultAccessModel();
}
export class ResultAccessModel {
  AccessDeleteRow = false;
  AccessWatchRow = false;
  AccessEditRow = false;
  AccessAddRow = false;
  AccessRowInPanelDemo = false;
  AccessRowWatchInSharingCategory = false;
  AccessWatchRowOtherSiteId = false;
  AccessWatchRowOtherCreatedBy = false;
  AccessEditRowOtherSiteId = false;
  AccessEditRowOtherCreatedBy = false;
  AccessDeleteRowOtherCreatedBy = false;

  //Fields: Array<string>;
  AccessSearchField: Array<string>;
  AccessWatchField: Array<string>;
  AccessEditField: Array<string>;
  AccessAddField: Array<string>;
  FieldsInfo: Array<FieldInfoModel>;
}
export class FieldInfoModel {
  FieldName: string;
  FieldType: string;
  FieldTypeClass: string;
  FieldTitle: string;
  FieldDescription: string;
  FieldScriptDescription: string;
  FieldDefaultValue: string;
  FieldValue: string;
  FieldTypeFullName: string;
  AccessSearchField: boolean=false;
  AccessWatchField: boolean=false;
  AccessEditField: boolean=false;
  AccessAddField: boolean=false;
  AccessGridViewField: boolean=false;
  fieldsInfo: Array<FieldInfoModel>;
}

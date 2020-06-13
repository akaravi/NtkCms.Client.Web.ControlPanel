import { SortType } from '../Enums/sortType.enum';
import { ExportFileType } from '../Enums/exportFileType.enum';
import { ExportReceiveMethod } from '../Enums/exportReceiveMethod.enum';
import { ClauseType } from '../Enums/clauseType.enum';
import { FilterDataModelSearchTypes } from '../Enums/filterDataModelSearchTypes.enum';

export class FilterModel {

  Filters: Array<FilterDataModel> = new Array<FilterDataModel>();
  Count: boolean = false;
  TotalRowData: number;
  SkipRowData: number = 0;
  CurrentPageNumber: number = 1;
  RowPerPage: number = 20;
  SortType: SortType = 1;
  SortColumn: string;
  ExportFile: ExportFileModel;
}
export class FilterDataModel {
  Filters: Array<FilterDataModel> = new Array<FilterDataModel>();
  value:any;
  value2:any;
  StringForceNullSearch: boolean;
  DecimalForceNullSearch: boolean;
  LatitudeLongitudeForceNullSearch: boolean;
  IntValueForceNullSearch: boolean;
  PropertyName: string;
  PropertyAnyName: string;
  ClauseType: ClauseType;
  SearchType: FilterDataModelSearchTypes;
  StringValue1: string;
  StringContainValues: Array<string> = new Array<string>();
  IntValue1: number;
  IntValue2: number;
  IntContainValues: Array<number> = new Array<number>();
  DateTimeValue1: Date;
  DateTimeValue2: Date;
  BooleanValue1: boolean;
  EnumValue1: string;
  SingleValue1: number;
  SingleValue2: number;
  DecimalValue1: number;
  DecimalValue2: number;
  LatitudeValue1: number;
  LatitudeValue2: number;
  LatitudeLongitudeDistanceValue1: number;
  LatitudeLongitudeDistanceValue2: number;
  LatitudeLongitudeSortType: string;
  HierarchyIdLevel: number;
  ObjectIdContainValues: Array<string> = new Array<string>();
  ObjectIdValue1: string;
}
export class ExportFileModel {
  FileType: ExportFileType;
  RecieveMethod: ExportReceiveMethod;
  RowCount: number;
}


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
  resultAccess: any;
}

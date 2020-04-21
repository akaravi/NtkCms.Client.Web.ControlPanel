export class ErrorExcptionResultBase {
  Status: number;
  token: string;
  IsSuccess: boolean;
  errors: any;
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

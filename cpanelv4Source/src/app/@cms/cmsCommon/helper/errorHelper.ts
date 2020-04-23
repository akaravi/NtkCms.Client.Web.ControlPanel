import { Injectable } from '@angular/core';
import { ErrorExcptionResultBase } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorHelper {
  constructor() {}
  GetString(model: ErrorExcptionResultBase) {
    if (!model) {
      return 'Error';
    }
    if (model.errors) {
      let ret = '';

      
        var aaa =model.errors.keys;
    

      return ret;
    } else if (model && model.ErrorMessage) {
      return model.ErrorMessage;
    }
    return 'Error';
  }
}

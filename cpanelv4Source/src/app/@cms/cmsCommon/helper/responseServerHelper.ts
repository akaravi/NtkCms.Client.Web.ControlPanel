import { Injectable } from '@angular/core';
import { ErrorExcptionResultBase } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';



@Injectable({
    providedIn: 'root',
  })
  export class ResponseServerHelper {
    constructor(private router:Router) {}
    Check(model: any) {
      if (!model) {
        return 'Error';
      }
      if(!model){
      this.router.navigate([environment.cmsUiConfig.Pathlogin]);
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
  
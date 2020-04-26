import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { ToastrService } from 'ngx-toastr';
import { ApiServerConfigSiteBaseService } from 'app/@cms/cmsCommon/services/apiServerConfigSiteBase.service';
import { CoreSiteService } from '../coreSite.service';

@Component({
  selector: 'app-cms-site-add',
  templateUrl: './coreSiteAdd.component.html',
  styleUrls: ['./coreSiteAdd.component.scss']
})
export class CoreSiteAddComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModel: ErrorExcptionResult<any> = new ErrorExcptionResult<any>();
  //dataModelDomains: Array<string> ;//=  {'oco.ir','qwp.ir'};
  dataModelLoad = false;
  model: any = {};
  dataModelDomains = [
    {id: 1, name: 'Vilnius'},
];

selectedDomain: any;
  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    ) {

     }

  ngOnInit() {

    this.modelInfo();
    this.coreSiteService.ServiceDomains(0).subscribe(
      (next) => {
        if (next.IsSuccess) {
          
            this.dataModelDomains=next.ListItems;
          
          //this.router.navigate(['/cms/dashboard/dashboard1']);
        }
      },
      (error) => {
        this.alertService.error(this.publicHelper.CheckError( error), 'خطا در دریافت لیست دامنه های قابل استفاده');
      }

    );
  }
modelInfo()
{
  this.coreSiteService.ServiceModelInfo().subscribe(
    (next) => {
      if (next.IsSuccess) {
          this.dataModel=next;
      }
    },
    (error) => {
      this.alertService.error(this.publicHelper.CheckError( error), 'خطا در دریافت لیست دامنه های قابل استفاده');
    }

  );

}
}

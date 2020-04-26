import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cms-site-add',
  templateUrl: './coreSiteAdd.component.html',
  styleUrls: ['./coreSiteAdd.component.scss']
})
export class CoreSiteAddComponent implements OnInit {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModel: ErrorExcptionResult<any>;
  //dataModelDomains: Array<string> ;//=  {'oco.ir','qwp.ir'};
  dataModelLoad = false;
  model: any = {};
  dataModelDomains = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
];

selectedDomain: any;
  constructor(
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    ) {

     }

  ngOnInit() {
  }

}

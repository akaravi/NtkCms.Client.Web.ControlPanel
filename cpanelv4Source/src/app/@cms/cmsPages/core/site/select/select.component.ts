import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreSiteService } from '../coreSite.service';
import { Subscription } from 'rxjs';
import { FilterModel } from 'app/@cms/cmsModels/base/filterModel';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { ErrorExcptionResult } from 'app/@cms/cmsModels/base/errorExcptionResult';
import { AuthRenewTokenModel } from 'app/@cms/cmsModels/core/authModel';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cms-site-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class CoreSiteSelectComponent implements OnInit, OnDestroy {
  subManager = new Subscription();
  filteModel = new FilterModel();
  dataModel: ErrorExcptionResult<any>;
  dataModelLoad = false;
  constructor(
    private coreSiteService: CoreSiteService,
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private router: Router,
  ) {

    this.coreSiteService.ServiceConstructor()

  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ngOnInit() {
    this.CoreSiteGetAll();
  }
  CoreSiteGetAll(){
    this.subManager.add(
      this.coreSiteService.ServiceGetAll(this.filteModel).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.dataModel = next;
            this.dataModelLoad = true;
            this.alertService.info('اطلاعات دریافت شد', 'توجه');
          }
        },
        (error) => {
          this.alertService.error( this.publicHelper.CheckError(error),'خطا در دریافت اطلاعات وب سایتها' );
        }
      )
    );
  }
  trackByFn() {}
  clickSelectSite(model: any) {
   let  AuthModel: AuthRenewTokenModel;
   AuthModel = new AuthRenewTokenModel;
    AuthModel.SiteId = model['Id'];
    this.subManager.add(
    this.coreSiteService.ServiceSelectSite(AuthModel).subscribe(
      (next) => {
        if (next.IsSuccess) {

          this.router.navigate(['/cms/dashboard/dashboard1']);
        }
      },
      (error) => {
        this.alertService.error(this.publicHelper.CheckError( error), 'خطا در ورود');
      }

    ));
  }
}

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmsAuthService } from '../../../../cmsService/core/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../cmsStore';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { AuthUserSignInModel } from 'app/@cms/cmsModels/core/authModel';

@Component({
  selector: 'app-cms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) loginForm: NgForm;
  subManager = new Subscription();
  model: AuthUserSignInModel = new AuthUserSignInModel();
  returnUrl: any = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cmsAuthService: CmsAuthService,
    private alertService: ToastrService,
    private store: Store<fromStore.State>,
    private publicHelper: PublicHelper
  ) {}
  ngOnInit() {
    this.model.IsRemember = false;
    this.model.Email = 'amin@gmail.com';
    
    
    this.subManager.add(
      this.route.queryParams.subscribe(
        (params) => (this.returnUrl = params.return)
      )
    );
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  // On submit button click
  onSubmit() {
    this.subManager.add(
      this.cmsAuthService.ServiceSigninUser(this.model).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.store.dispatch(new fromStore.InitHub());
            if (this.returnUrl === null || this.returnUrl === undefined) {
              this.returnUrl = this.cmsAuthService.getDashboardUrl();
            }
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          this.alertService.error(this.publicHelper.CheckError( error), 'خطا در ورود');
        }
      )
    );
  }
 
}

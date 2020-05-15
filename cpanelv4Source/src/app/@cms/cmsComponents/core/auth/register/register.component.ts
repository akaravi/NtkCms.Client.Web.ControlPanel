import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmsAuthService } from '../../../../cmsService/core/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../cmsStore';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';
import { environment } from 'environments/environment';
import { AuthUserSignUpModel } from 'app/@cms/cmsModels/core/authModel';

@Component({
    selector: 'app-cms-register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
    @ViewChild('f', {static: false}) registerForm: NgForm;
  subManager = new Subscription();
  model: AuthUserSignUpModel =new AuthUserSignUpModel();
  returnUrl: any = '';
  _cmsUiConfig=environment.cmsUiConfig;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: CmsAuthService,
    private alertService: ToastrService,
    private store: Store<fromStore.State>,
    private publicHelper: PublicHelper

  ) {}
    ngOnInit() {
         this.subManager.add(
          this.route.queryParams.subscribe(
            (params) => (this.returnUrl = params.return)
          )
        );
      }
      ngOnDestroy() {
        this.subManager.unsubscribe();
        
      }

    //  On submit click, reset field value
    onSubmit() {
        this.subManager.add(
          this.authService.ServiceSignupUser(this.model).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.store.dispatch(new fromStore.InitHub());
                if (this.returnUrl === null || this.returnUrl === undefined) {
                  this.returnUrl = this.authService.getLoginUrl();
                }
                this.alertService.info('وارد حساب خود شوید', 'توجه');

                this.router.navigate([this.returnUrl]);
              }
            },
            (error) => {
              this.alertService.error(this.publicHelper.CheckError( error), 'خطا در ثبت نام');
            }
          )
        );
      }
}

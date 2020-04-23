import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmsAuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../cmsStore';
import { ToastrService } from 'ngx-toastr';
import { ErrorHelper } from 'app/@cms/cmsCommon/helper/errorHelper';

@Component({
    selector: 'app-register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
    @ViewChild('f', {static: false}) registerForm: NgForm;
  subManager = new Subscription();
  model: any = {};
  returnUrl: any = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: CmsAuthService,
    private alertService: ToastrService, 
    private store: Store<fromStore.State>,
    private errorHelper: ErrorHelper

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
          this.authService.signupUser(this.model).subscribe(
            (ret) => {
              if (ret.IsSuccess) {
                this.store.dispatch(new fromStore.InitHub());
                if (this.returnUrl === null || this.returnUrl === undefined) {
                  this.returnUrl = this.authService.getLoginUrl();
                }
                this.alertService.info('وارد حساب خود شوید', 'توجه');

                this.router.navigate([this.returnUrl]);
              }
            },
            (ret) => {
              this.alertService.error(this.errorHelper.GetString( ret.error), 'خطا در ثبت نام');
            }
          )
        );
      }
}

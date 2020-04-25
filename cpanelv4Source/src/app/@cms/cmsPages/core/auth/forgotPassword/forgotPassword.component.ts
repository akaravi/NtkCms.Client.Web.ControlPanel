import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmsAuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../cmsStore';
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';

@Component({
  selector: 'app-cms-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy  {
  @ViewChild('f', { static: false }) loginForm: NgForm;
  subManager = new Subscription();
  model: any = {};
  returnUrl: any = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: CmsAuthService,
    private alertService: ToastrService,
    private store: Store<fromStore.State>,
    private publicHelper: PublicHelper
  ) {}

  ngOnInit() {
    this.model.isremember = true;
    this.subManager.add(
      this.route.queryParams.subscribe(
        (params) => (this.returnUrl = params.return)
      )
    );
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  // On submit click, reset form fields
  onSubmit() {
    this.subManager.add(
      this.authService.forgetPassword(this.model).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.store.dispatch(new fromStore.InitHub());
            if (this.returnUrl === null || this.returnUrl === undefined) {
              this.returnUrl = this.authService.getLoginUrl();
            }
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          this.alertService.error(
            this.publicHelper.CheckError(error),
            'خطا در بازیابی پسورد'
          );
        }
      )
    );
  }
}

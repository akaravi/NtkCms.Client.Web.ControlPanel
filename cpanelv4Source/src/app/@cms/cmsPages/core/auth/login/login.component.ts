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
  selector: 'app-cms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
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
    private errorHelper: ErrorHelper
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

  // On submit button click
  onSubmit() {
    this.subManager.add(
      this.authService.signinUser(this.model).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.store.dispatch(new fromStore.InitHub());
            if (this.returnUrl === null || this.returnUrl === undefined) {
              this.returnUrl = this.authService.getDashboardUrl();
            }
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          this.alertService.error(this.errorHelper.CheckError( error), 'خطا در ورود');
        }
      )
    );
  }
 
}

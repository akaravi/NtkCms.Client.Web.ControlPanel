import { Component, OnInit } from "@angular/core";
import { CoreUserService } from "app/@cms/cmsService/core/coreUser.service";
import { CoreUser } from "app/@cms/cmsModels/core/coreUser";
import { ToastrService } from "ngx-toastr";
import { PublicHelper } from "app/@cms/cmsCommon/helper/publicHelper";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CmsAuthService } from "app/@cms/cmsService/core/auth.service";
import { AuthUserChangePasswordModel } from "app/@cms/cmsModels/core/authModel";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class CoreUserProfileComponent implements OnInit {
  CorrectUserInfo: CoreUser = new CoreUser();
  CoreUserEditformGroup: FormGroup;
  CoreUserPasswordEditformGroup: FormGroup;
  //Variable Declaration
  currentPage: string = "About";
  constructor(
    private coreUserService: CoreUserService,
    private alertService: ToastrService,
    private publicHelper: PublicHelper,
    private cmsAuthService: CmsAuthService
  ) {}
  ngOnInit() {
    this.CoreUserEditformGroup = new FormGroup({
      Name: new FormControl(),
      LastName: new FormControl(),
      BirthDay: new FormControl(),
      Gender: new FormControl(),
      FullName: new FormControl(),
      Address: new FormControl(),
      PostalCode: new FormControl(),
      FirewallAllowIP: new FormControl(),
    });

    this.CoreUserPasswordEditformGroup = new FormGroup(
      {
        OldPassword: new FormControl("", Validators.required),
        NewPassword: new FormControl("", Validators.required),
        NewPasswordConfirm: new FormControl("", Validators.required),
      },
      this.passwordMatchValidator
    );

    this.coreUserService.CorrectUserObs.subscribe((vlaue) => {
      this.CorrectUserInfo = vlaue;
    });

    this.coreUserService.ServiceCurrectUser().subscribe(
      (next) => {
        this.CorrectUserInfo = next.Item;
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "خطا در ورود"
        );
      }
    );
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get("NewPassword").value === g.get("NewPasswordConfirm").value
      ? null
      : { mismath: true };
  }
  showPage(page: string) {
    this.currentPage = page;
  }
  onSubmitCoreUserPasswordEdit() {
    let model: AuthUserChangePasswordModel = new AuthUserChangePasswordModel();
    if (!this.CoreUserPasswordEditformGroup.valid) {
      return;
    }
    model.OldPassword = this.CoreUserPasswordEditformGroup.get(
      "OldPassword"
    ).value;
    model.NewPassword = this.CoreUserPasswordEditformGroup.get(
      "NewPassword"
    ).value;
    this.cmsAuthService.ServiceChangePassword(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
        
        }
      },
      (error) => {
        this.alertService.error(
          this.publicHelper.CheckError(error),
          "خطا در تغییر پسورد"
        );
      }
    );
  }
}

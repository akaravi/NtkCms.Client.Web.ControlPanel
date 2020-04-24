import { Component, OnInit, OnDestroy } from "@angular/core";
import { SiteService } from "../site.service";
import { Subscription } from "rxjs";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { ToastrService } from "ngx-toastr";
import { ErrorHelper } from "app/@cms/cmsCommon/helper/errorHelper";

@Component({
  selector: "app-cms-site-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
})
export class SiteSelectComponent implements OnInit, OnDestroy {
  subManager = new Subscription();
  filteModel = new FilterModel();
  constructor(
    private siteService: SiteService,
    private alertService: ToastrService,
    private errorHelper: ErrorHelper
  ) {}
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  ngOnInit() {
    this.subManager.add(
      this.siteService.getAll(this.filteModel).subscribe(
        (ret) => {
          if (ret.IsSuccess) {
            this.alertService.info("وارد حساب خود شوید", "توجه");
          }
        },
        (ret) => {
          this.alertService.error(
            this.errorHelper.GetString(ret.error),
            "خطا در ثبت نام"
          );
        }
      )
    );
  }
}

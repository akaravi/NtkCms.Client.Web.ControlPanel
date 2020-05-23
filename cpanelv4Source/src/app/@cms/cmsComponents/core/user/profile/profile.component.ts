import { Component, OnInit } from "@angular/core";
import { CoreUserService } from "app/@cms/cmsService/core/coreUser.service";
import { CoreUser } from "app/@cms/cmsModels/core/coreUser";
import { ToastrService } from 'ngx-toastr';
import { PublicHelper } from 'app/@cms/cmsCommon/helper/publicHelper';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class CoreUserProfileComponent implements OnInit {
  CorrectUserInfo: CoreUser = new CoreUser();
  //Variable Declaration
  currentPage: string = "About";
  constructor(private coreUserService: CoreUserService,
    private alertService: ToastrService,
    private publicHelper: PublicHelper) {}
  ngOnInit() {
    
    this.coreUserService.CorrectUserObs.subscribe((vlaue) => {
      this.CorrectUserInfo = vlaue;
    });
   this.coreUserService.ServiceCurrectUser().subscribe((next)=>{
    this.CorrectUserInfo=next.Item
   },(error)=>{
    this.alertService.error(this.publicHelper.CheckError( error), 'خطا در ورود');

   }
   
   )
  }

  showPage(page: string) {
    this.currentPage = page;
  }
}

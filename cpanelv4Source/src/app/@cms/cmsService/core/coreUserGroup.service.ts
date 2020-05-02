import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
@Injectable({
  providedIn: "root",
})
export class CoreUserGroupService extends ApiServerBaseService
  implements OnDestroy {
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreUserGroup";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}

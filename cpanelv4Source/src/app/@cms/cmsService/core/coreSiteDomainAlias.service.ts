import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
@Injectable({
  providedIn: "root",
})
export class CoreSiteDomainAliasService extends ApiServerBaseService
  implements OnDestroy {
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreSiteDomainAlias";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}

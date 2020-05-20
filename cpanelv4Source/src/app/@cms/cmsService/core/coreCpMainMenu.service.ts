import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { ApiServerBaseService } from "../_base/apiServerBase.service";
import { FilterModel } from "app/@cms/cmsModels/base/filterModel";
import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";
import { catchError, map, retry } from "rxjs/operators";
import { CoreCpMainMenuModel } from "app/@cms/cmsModels/core/CoreCpMainMenuModel";
@Injectable({
  providedIn: "root",
})
export class CoreCpMainMenuService extends ApiServerBaseService
  implements OnDestroy {
  coreCpMainMenu = new BehaviorSubject<Array<CoreCpMainMenuModel>>(
    new Array<CoreCpMainMenuModel>()
  );
  coreCpMainMenuObs = this.coreCpMainMenu.asObservable();
  subManager = new Subscription();
  getModuleCotrolerUrl() {
    return "CoreCpMainMenu";
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  SetCoreCpMainMenu(model: Array<CoreCpMainMenuModel>) {
    if (model == null) model = new Array<CoreCpMainMenuModel>();
    this.coreCpMainMenu.next(model);
  }
  ServiceGetMenu(model: FilterModel) {
    this.ServiceGetAllMenu(null).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.SetCoreCpMainMenu(next.ListItems);
        }
      },
      (error) => {}
    );
  }
  ServiceGetAllMenu(model: FilterModel) {
    if (model == null) model = new FilterModel();
    model.RowPerPage = 200;
    return this.http
      .post(this.baseUrl + this.getModuleCotrolerUrl() + "/GetAllMenu", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<CoreCpMainMenuModel>) => {
          this.SetCoreCpMainMenu(ret.ListItems);
          return this.errorExcptionResultCheck<CoreCpMainMenuModel>(ret);
        })
      );
  }
  ServiceEditStep<TOut>(model: any) {
    return this.http
      .put(this.baseUrl + this.getModuleCotrolerUrl() + "/EditStep", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map((ret: ErrorExcptionResult<TOut>) => {
          return this.errorExcptionResultCheck<TOut>(ret);
        })
      );
  }
}

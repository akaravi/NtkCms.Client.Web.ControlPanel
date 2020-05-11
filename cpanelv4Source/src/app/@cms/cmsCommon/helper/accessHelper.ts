import { ErrorExcptionResult } from "app/@cms/cmsModels/base/errorExcptionResult";

export class AccessHelper {
  constructor() {}

  AccessDeleteRow(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessDeleteRow;
  }
  AccessWatchRow(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return false; // return model?.resultAccess?.AccessWatchRow;
  }
  AccessEditRow(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessEditRow;
  }
  AccessAddRow(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return  model.resultAccess.AccessAddRow;
  }
  AccessRowInPanelDemo(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessRowInPanelDemo;
  }
  AccessRowWatchInSharingCategory(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessRowWatchInSharingCategory;
  }
  AccessWatchRowOtherSiteId(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return false;
  }
  AccessWatchRowOtherCreatedBy(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessWatchRowOtherCreatedBy;
  }
  AccessEditRowOtherSiteId(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessEditRowOtherSiteId;
  }
  AccessEditRowOtherCreatedBy(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessEditRowOtherCreatedBy;
  }
  AccessDeleteRowOtherCreatedBy(model: ErrorExcptionResult<any>) {
    if (!model) return false;
    if (!model.resultAccess) return false;
    return model.resultAccess.AccessDeleteRowOtherCreatedBy;
  }
}

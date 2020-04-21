import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TokenInfoModel } from 'app/@cms/cmsModels/base/tokenInfoModel';


export const selectLoggedUserName = (state: TokenInfoModel) => state.Name;
export const selectLoggedUserPhotoUrl = (state: TokenInfoModel) => state.PhotoUrl;
export const selectLoggedUserId = (state: TokenInfoModel) => state.UserId;
export const selectLoggedSiteId = (state: TokenInfoModel) => state.SiteId;

export const getLoggedUserState = createFeatureSelector<TokenInfoModel>('loggedUser');
export const getLoggedUserId = createSelector(getLoggedUserState, selectLoggedUserId);
export const getLoggedSiteId = createSelector(getLoggedUserState, selectLoggedSiteId);
export const getLoggedUserName = createSelector(getLoggedUserState, selectLoggedUserName);
export const getLoggedUserPhotoUrl = createSelector(getLoggedUserState, selectLoggedUserPhotoUrl);
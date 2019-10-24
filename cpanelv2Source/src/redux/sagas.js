import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import todoSagas from './todo/saga';
import chatSagas from './chat/saga';
import surveyListSagas from './surveyList/saga';
import surveyDetailSagas from './surveyDetail/saga';
import coreSiteSagas from './cmsModule/core/site/saga';
import coreUserSagas from './cmsModule/core/user/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    todoSagas(),
    chatSagas(),
    surveyListSagas(),
    surveyDetailSagas(),
    coreSiteSagas(),
    coreUserSagas()
  ]);
}

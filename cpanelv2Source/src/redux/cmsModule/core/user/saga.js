
import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
	CORE_USER_ACT_GETALL,
	CORE_USER_ACT_GETONE,
	CORE_USER_ACT_SELECTCURRENTSITE
} from 'Constants/actionTypes';

import {
	getCoreUserActSelectCurrentSiteSuccess,
	getCoreUserActSelectCurrentSiteError,

	getCoreUserActGetAllSuccess,
	getCoreUserActGetAllError,

	getCoreUserActGetOneSuccess,
    getCoreUserActGetOneError
} from './actions';
import {
    cmsServerConfig
} from 'Constants/defaultValues';

// import surveyDetailData from 'Data/survey.detail.json';

const getCoreUserActSelectCurrentSiteRequestAsync = async (id) => {
	const headers = {
		'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userGlobaltoken') 
    };
    const postData = {
        SiteId:id
    };
    return await axios.post(cmsServerConfig.configApiServerPath + `Auth/RenewToken/`,postData, {
            headers: headers
        })
        .then(
            response => {
                return response.data;
            }
        )
        .catch(
            error => {
                return error;
            }

        );

}


const getCoreUserActGetOneRequestAsync = async (Id) => {
	const headers = {
		'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userGlobaltoken') 
    };
  
    return await axios.get(cmsServerConfig.configMvcServerPath + `/api/CoreUser/GetOne/`+Id, {
            headers: headers
        })
        .then(
            response => {
                return response.data;
            }
        )
        .catch(
            error => {
                return error;
            }

        );

}

const getCoreUserActGetAllRequestAsync = async (filterModel) => {
	const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userGlobaltoken') 
    };
    const postData = {
        
    };
    return await axios.post(cmsServerConfig.configMvcServerPath + `/api/CoreUser/Getall`, postData, {
            headers: headers
        })
        .then(
            response => {
                return response.data;
            }
        )
        .catch(
            error => {
                return error;
            }

        );
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions

function* sagaCoreUserActSelectCurrentSite({
    id
}) {
	alert("saga getCoreUserActSelectCurrentSite  Start")
	try {
		const response = yield call(getCoreUserActSelectCurrentSiteRequestAsync,id);
		yield put(getCoreUserActSelectCurrentSiteSuccess(response));
	} catch (error) {
		yield put(getCoreUserActSelectCurrentSiteError(error));
	}
}


function* sagaCoreUserActGetAll() {
	try {
		const response = yield call(getCoreUserActGetAllRequestAsync);
		yield put(getCoreUserActGetAllSuccess(response));
	} catch (error) {
		yield put(getCoreUserActGetAllError(error));
	}
}

function* sagaCoreUserActGetOne() {
	try {
		const response = yield call(getCoreUserActGetOneRequestAsync);
		yield put(getCoreUserActGetOneSuccess(response));
	} catch (error) {
		yield put(getCoreUserActGetOneError(error));
	}
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* watchCoreUserActSelectCurrentSite() {
	yield takeEvery(CORE_USER_ACT_SELECTCURRENTSITE, sagaCoreUserActSelectCurrentSite);
}

export function* watchCoreUserActGetAll() {
	yield takeEvery(CORE_USER_ACT_GETALL, sagaCoreUserActGetAll);
}
export function* watchCoreUserActGetOne() {
	yield takeEvery(CORE_USER_ACT_GETONE, sagaCoreUserActGetOne);
}

export default function* rootSaga() {
	yield all([
		fork(watchCoreUserActSelectCurrentSite),
		fork(watchCoreUserActGetAll),
		fork(watchCoreUserActGetOne),
	]);
}
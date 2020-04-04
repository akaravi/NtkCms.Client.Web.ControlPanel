
import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
	CORE_SITE_ACT_GETALL,
	CORE_SITE_ACT_GETONE
} from 'Constants/actionTypes';

import {
	
	getCoreSiteActGetAllSuccess,
	getCoreSiteActGetAllError,

	getCoreSiteActGetOneSuccess,
	getCoreSiteActGetOneError
} from './actions';
import {
    cmsServerConfig
} from 'Constants/defaultValues';

// import surveyDetailData from 'Data/survey.detail.json';


const getCoreSiteActGetOneRequestAsync = async (Id) => {
	const headers = {
		'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userGlobaltoken') 
    };
  
    return await axios.get(cmsServerConfig.configMvcServerPath + `/api/CoreSite/GetOne/`+Id, {
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

const getCoreSiteActGetAllRequestAsync = async (filterModel) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userGlobaltoken') 
    };
    const postData = {
        
    };
    return await axios.post(cmsServerConfig.configMvcServerPath + `/api/CoreSite/Getall`, postData, {
            headers: headers
        })
        .then(
            response => {
                return response.data;
            }
        )
        // .catch(
        //     error => {
        //         return error;
        //     }

        // );
		// survey.questions = survey.questions.filter(x => x.id != quesitonId);
		// return await new Promise((success, fail) => {
		// 	success(survey);
		// })
		// 	.then(response => response)
		// 	.catch(error => error);
	
}

function* sagaGetCoreSiteActGetAll() {
	try {
        const response = yield call(getCoreSiteActGetAllRequestAsync);
        console.log("sagaGetCoreSiteActGetAll:");
        console.log(response);
		yield put(getCoreSiteActGetAllSuccess(response.ListItems));
	} catch (error) {
		yield put(getCoreSiteActGetAllError(error));
	}
}
function* sagaGetCoreSiteActGetOne() {
	try {
		const response = yield call(getCoreSiteActGetOneRequestAsync);
		yield put(getCoreSiteActGetOneSuccess(response));
	} catch (error) {
		yield put(getCoreSiteActGetOneError(error));
	}
}



export function* watchCoreSiteActGetAll() {
	
	yield takeEvery(CORE_SITE_ACT_GETALL, sagaGetCoreSiteActGetAll);
	
}
export function* watchCoreSiteActGetOne() {
	yield takeEvery(CORE_SITE_ACT_GETONE, sagaGetCoreSiteActGetOne);
}


export default function* rootSaga() {
	yield all([
		fork(watchCoreSiteActGetAll),
		fork(watchCoreSiteActGetOne),
	]);
}
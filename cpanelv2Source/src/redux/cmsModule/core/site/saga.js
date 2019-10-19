
import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
	CORE_SITE_ACT_GETALL,
	CORE_SITE_ACT_GETONE

	,SURVEY_GET_DETAILS,
	SURVEY_DELETE_QUESTION,
	SURVEY_SAVE
} from 'Constants/actionTypes';

import {
	
	getCoreSiteActGetAllSuccess,
	getCoreSiteActGetAllError,

	getCoreSiteActGetOneSuccess,
	getCoreSiteActGetOneError,
	saveSurvey
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
  
    return await axios.get(cmsServerConfig.mainPath + `/api/CoreSite/GetOne/`+Id, {
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
    return await axios.post(cmsServerConfig.mainPath + `/api/CoreSite/Getall`, postData, {
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
		// survey.questions = survey.questions.filter(x => x.id != quesitonId);
		// return await new Promise((success, fail) => {
		// 	success(survey);
		// })
		// 	.then(response => response)
		// 	.catch(error => error);
	
}


function* getCoreSiteActGetAll() {
	try {
		const response = yield call(getCoreSiteActGetAllRequestAsync);
		yield put(getCoreSiteActGetAllSuccess(response));
	} catch (error) {
		yield put(getCoreSiteActGetAllError(error));
	}
}
function* getCoreSiteActGetOne() {
	try {
		const response = yield call(getCoreSiteActGetOneRequestAsync);
		yield put(getCoreSiteActGetOneSuccess(response));
	} catch (error) {
		yield put(getCoreSiteActGetOneError(error));
	}
}

// function* deleteQuestion({ payload }) {
// 	try {
// 		const { questionId, survey } = payload;
// 		const response = yield call(deleteQuestionRequest, questionId, survey);
// 		yield put(saveSurvey(response));
// 	} catch (error) {
// 		yield put(getSurveyDetailError(error));
// 	}
// }



export function* watchCoreSiteActGetAll() {
	
	yield takeEvery(CORE_SITE_ACT_GETALL, getCoreSiteActGetAll);
	
}
export function* watchCoreSiteActGetOne() {
	yield takeEvery(CORE_SITE_ACT_GETONE, getCoreSiteActGetOne);
}

// export function* watchDeleteQuestion() {
// 	yield takeEvery(SURVEY_DELETE_QUESTION, deleteQuestion);
// }



export default function* rootSaga() {
	yield all([
		fork(watchCoreSiteActGetAll),
		fork(watchCoreSiteActGetOne),
	]);
}
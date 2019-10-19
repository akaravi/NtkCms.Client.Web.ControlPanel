import {
	CORE_SITE_ACT_GETALL_SUCCESS,
	CORE_SITE_ACT_GETALL_ERROR,
	CORE_SITE_ACT_GETONE_SUCCESS,
	CORE_SITE_ACT_GETONE_ERROR

	// ,SURVEY_GET_DETAILS,
	// SURVEY_GET_DETAILS_SUCCESS,
	// SURVEY_GET_DETAILS_ERROR,
	// SURVEY_DELETE_QUESTION,
	// SURVEY_SAVE
} from 'Constants/actionTypes';

const INIT_STATE = {
	survey: null,
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case CORE_SITE_ACT_GETALL:
			return {
				...state, loading: false
			};

		case CORE_SITE_ACT_GETALL_SUCCESS:
			return {
				...state, loading: true, errorExption: action.payload
			};

		case CORE_SITE_ACT_GETALL_ERROR:
			return {
				...state, loading: true, error: action.payload
			};

		case CORE_SITE_ACT_GETONE:
			return {
				...state, loading: false
			};

		case CORE_SITE_ACT_GETONE_SUCCESS:
			return {
				...state, loading: true, errorExption: action.payload
			};

		case CORE_SITE_ACT_GETONE_ERROR:
			return {
				...state, loading: true, error: action.payload
			};

			// case SURVEY_DELETE_QUESTION:
			// return { ...state,loading:false};

			// case SURVEY_SAVE:
			// return { ...state,loading:true,survey: action.payload};



		default:
			return {
				...state
			};
	}
}
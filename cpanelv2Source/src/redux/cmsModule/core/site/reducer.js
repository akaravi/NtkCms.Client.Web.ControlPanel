import {
	CORE_SITE_ACT_GETALL,
	CORE_SITE_ACT_GETALL_SUCCESS,
	CORE_SITE_ACT_GETALL_ERROR,

	CORE_SITE_ACT_GETONE,
	CORE_SITE_ACT_GETONE_SUCCESS,
	CORE_SITE_ACT_GETONE_ERROR


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

		
		default:
			return {
				...state
			};
	}
}
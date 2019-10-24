import {
	CORE_USER_ACT_SELECTCURRENTSITE,
    CORE_USER_ACT_SELECTCURRENTSITE_SUCCESS,
	CORE_USER_ACT_SELECTCURRENTSITE_ERROR,
	
	CORE_USER_ACT_GETALL,
	CORE_USER_ACT_GETALL_SUCCESS,
	CORE_USER_ACT_GETALL_ERROR,

	CORE_USER_ACT_GETONE,
	CORE_USER_ACT_GETONE_SUCCESS,
	CORE_USER_ACT_GETONE_ERROR,
	
} from 'Constants/actionTypes';

const INIT_STATE = {
	user: localStorage.getItem('user_id'),
    loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
	
		case CORE_USER_ACT_SELECTCURRENTSITE:
			return { ...state, loading: true };
		case CORE_USER_ACT_SELECTCURRENTSITE_SUCCESS:
			return {
				...state, loading: true, errorExption: action.payload
			};

		case CORE_USER_ACT_SELECTCURRENTSITE_ERROR:
			return {
				...state, loading: true, error: action.payload
			};




		case CORE_USER_ACT_GETALL:
			return {
				...state, loading: false
			};

		case CORE_USER_ACT_GETALL_SUCCESS:
			return {
				...state, loading: true, errorExption: action.payload
			};

		case CORE_USER_ACT_GETALL_ERROR:
			return {
				...state, loading: true, error: action.payload
			};

			
		case CORE_USER_ACT_GETONE:
			return {
				...state, loading: false
			};

		case CORE_USER_ACT_GETONE_SUCCESS:
			return {
				...state, loading: true, errorExption: action.payload
			};

		case CORE_USER_ACT_GETONE_ERROR:
			return {
				...state, loading: true, error: action.payload
			};

		default:
			return {
				...state
			};
	}
}
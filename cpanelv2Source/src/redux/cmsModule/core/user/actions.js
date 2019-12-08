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




export const getCoreUserActSelectCurrentSite = (id) => {

    return ({
        type: CORE_USER_ACT_SELECTCURRENTSITE,
        id:id
    });
}

export const getCoreUserActSelectCurrentSiteSuccess = (errorExption) => ({
    type: CORE_USER_ACT_SELECTCURRENTSITE_SUCCESS,
    payload: errorExption
});

export const getCoreUserActSelectCurrentSiteError = (error) => ({
    type: CORE_USER_ACT_SELECTCURRENTSITE_ERROR,
    payload: error
});



export const getCoreUserActGetAll = (filterModel) => ({
    type: CORE_USER_ACT_GETALL,
    payload: filterModel
});
export const getCoreUserActGetAllSuccess = (errorExption) => ({
    type: CORE_USER_ACT_GETALL_SUCCESS,
    payload: errorExption
});

export const getCoreUserActGetAllError = (error) => ({
    type: CORE_USER_ACT_GETALL_ERROR,
    payload: error
});

export const getCoreUserActGetOne = (id) => ({
    type: CORE_USER_ACT_GETONE,
    payload: id
});

export const getCoreUserActGetOneSuccess = (errorExption) => ({
    type: CORE_USER_ACT_GETONE_SUCCESS,
    payload: errorExption
});

export const getCoreUserActGetOneError = (error) => ({
    type: CORE_USER_ACT_GETONE_ERROR,
    payload: error
});
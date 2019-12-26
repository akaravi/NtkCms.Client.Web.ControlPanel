import {
    CORE_SITE_ACT_GETALL,
    CORE_SITE_ACT_GETALL_SUCCESS,
    CORE_SITE_ACT_GETALL_ERROR,
    CORE_SITE_ACT_GETONE,
    CORE_SITE_ACT_GETONE_SUCCESS,
    CORE_SITE_ACT_GETONE_ERROR
} from 'Constants/actionTypes';

export const getCoreSiteActGetAll = (filterModel) => ({
    type: CORE_SITE_ACT_GETALL,
    payload: filterModel
});
export const getCoreSiteActGetAllSuccess = (errorExpetion) => ({
    type: CORE_SITE_ACT_GETALL_SUCCESS,
    payload: {errorExpetion}
});

export const getCoreSiteActGetAllError = (error) => ({
    type: CORE_SITE_ACT_GETALL_ERROR,
    payload: error
});

export const getCoreSiteActGetOne = (id) => ({
    type: CORE_SITE_ACT_GETONE,
    payload: id
});

export const getCoreSiteActGetOneSuccess = (errorExption) => ({
    type: CORE_SITE_ACT_GETONE_SUCCESS,
    payload: errorExption
});

export const getCoreSiteActGetOneError = (error) => ({
    type: CORE_SITE_ACT_GETONE_ERROR,
    payload: error
});


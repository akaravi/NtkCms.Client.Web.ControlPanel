import {
    all,
    call,
    fork,
    put,
    takeEvery
} from 'redux-saga/effects';
// import {
//     auth
// } from '../../firebase';
import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER
} from 'Constants/actionTypes';

import {
    loginUserSuccess,
    registerUserSuccess
} from './actions';
import {
    cmsServerConfig
} from 'Constants/defaultValues';

const loginWithEmailPasswordAsync = async (email, password) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'JWT fefege...'
    };
    const postData = {
        username: email,
        pwd: password,
        lang: 'fa'

    };
    return await axios.post(cmsServerConfig.configMvcServerPath + `/api/CoreUser/userlogin`, postData, {
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

// const loginWithEmailPasswordAsync_Old = async (email, password) =>
//     await auth.signInWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);



function* loginWithEmailPassword({
    payload
}) {
    alert("saga loginWithEmailPassword Start");
    const {
        email,
        password
    } = payload.user;
    const {
        history
    } = payload;
    try {
        alert("email: " + email + " password: " + password);
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (loginUser.IsSuccess) {
            localStorage.setItem('user_id', loginUser.Item);
            localStorage.setItem('user', loginUser.Item);
            localStorage.setItem('userGlobaltoken', loginUser.token);

            yield put(loginUserSuccess(loginUser));
            history.push('/');
        } else {
            // catch throw
            console.log('login failed :', loginUser.message)
        }
    } catch (error) {
        // catch throw
        console.log('login error : ', error)
    }
}

const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error);

function* registerWithEmailPassword({
    payload
}) {
    const {
        email,
        password
    } = payload.user;
    const {
        history
    } = payload
    try {
        // const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
        // if (!registerUser.message) {
        //     localStorage.setItem('user_id', registerUser.user.uid);
        //     yield put(registerUserSuccess(registerUser));
        //     history.push('/')
        // } else {
        //     // catch throw
        //     console.log('register failed :', registerUser.message)
        // }
    } catch (error) {
        // catch throw
        console.log('register error : ', error)
    }
}



const logoutAsync = async (history) => {
    //await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}

function* logout({
    payload
}) {
    const {
        history
    } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_id');
    } catch (error) {}
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser)
    ]);
}
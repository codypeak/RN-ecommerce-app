import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => { //if user already logged in just authenticate instead of making new request.
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token })
    };
};

export const signup = (email, password) => { //email and password passed in from outside to creat new user.
    return async dispatch => {
        const response = await fetch( //endpoint from https://firebase.google.com/docs/reference/rest/auth & web API key from project settings.
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBghM_YoeLRz8gd-iPJOImslD6FkrobSjk',
            {  //configure POST request with 2nd arg.
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ //POST request body payload needs these 3 things to create a new user.
                    email: email,
                    password: password,
                    returnSecureToken: true,
                })
            }
        ); 

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already.';
            } 
            throw new Error(message);
        }
        //if it is ok get response data by awaiting response json and transform it from json into js.
        const resData = await response.json();
        console.log(resData)
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)*1000)); //idToken and localId from firebase response.
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn)*1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const login = (email, password) => { 
    return async dispatch => {
        const response = await fetch( 
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBghM_YoeLRz8gd-iPJOImslD6FkrobSjk',
            {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password,
                    returnSecureToken: true,
                })
            }
        ); 

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found.';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid.'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData)
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)*1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn)*1000
        );//handles token expiration by converting to number milliseconds from string seconds. 
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);//after login forward token and userId to storage so remembered on restart.
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData'); //clear storage as well as timer. 
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) { //timer unintialized above, so only if exists (ie is not undefined) clear it.
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => { //use thunk and dispatch b/c timer is async task.
        setTimeout(() => { //func will run after time expires.
            dispatch(logout());
        }, expirationTime);
    };
};

//for auto login
const saveDataToStorage = (token, userId, expirationDate) => { 
    AsyncStorage.setItem( //use asyncStorage to persist data in device hard drive. store will not remember after turned off.
        'userData', 
        JSON.stringify({  //takes in key and value in string form so stringify user obj.
            token: token, 
            userId: userId,
            expiryDate: expirationDate.toISOString(),
        })
    );
}; //also need to check this on startup so adding a screen for that.

//could combine signup and login action creators and action types in reducer b/c doing pretty similar things. 
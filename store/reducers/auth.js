import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE: 
            return {
                token: action.token, //need token to access firebase api.
                userId: action.userId,
            };
        case LOGOUT: 
            return initialState; //in effect resetting token and userId to null.
        default: 
            return state;
    }
}
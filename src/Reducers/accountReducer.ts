import { Action, SET_LOGGED_IN, SET_LOGGED_OUT, SET_HOST, SET_WEB_ID, RESET_HOST, RESET_WEB_ID } from "../Actions/actionTypes";
import config from "../config";

interface AccountState {
    loggedIn: boolean;
    host: string | null;
    webId: string | null;
}

const initialState: AccountState = {
    loggedIn: false,
    host: null,
    webId: null
};

export const account = (state = initialState, action: Action<string|null|void>): AccountState => {
    switch(action.type) {
        case SET_LOGGED_IN:
            return { ...state, loggedIn: true };
        case SET_LOGGED_OUT:
            return { ...state, loggedIn: false };
        case SET_HOST:
            config.setHost(action.value as string); // TODO
            return { ...state, host: action.value as string };
        case RESET_HOST:
            return { ...state, host: null };
        case SET_WEB_ID:
            return { ...state, webId: action.value as string|null };
        case RESET_WEB_ID:
            return { ...state, webId: null };
        default:
            return state;
    }
};

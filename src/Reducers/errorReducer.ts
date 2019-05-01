import { Action, SET_ERROR_MESSAGE } from "../Actions/actionTypes";

export const errorMessage = (state = '', action: Action<string>): typeof state => {
    switch(action.type) {
        case SET_ERROR_MESSAGE:
            return action.value;
        default:
            return state;
    }
};
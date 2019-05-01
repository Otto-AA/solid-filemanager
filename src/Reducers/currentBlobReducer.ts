import { Action, SET_LOADED_BLOB, RESET_LOADED_BLOB } from "../Actions/actionTypes";

export const blob = (state: string|null = null, action: Action<Blob>): typeof state => {
    switch(action.type) {
        case SET_LOADED_BLOB:
            return URL.createObjectURL(action.value);
        case RESET_LOADED_BLOB:
            if (state !== null)
                URL.revokeObjectURL(state);
            return null;
        default:
            return state;
    }
};
import { Action, DISPLAY_LOADING, STOP_LOADING } from "../Actions/actionTypes";

const initialLoadingState: boolean = false;

export const loading = (state = initialLoadingState, action: Action<void>): boolean => {
    switch(action.type) {
        case DISPLAY_LOADING:
            return true;
        case STOP_LOADING:
            return false;
        default:
            return state;
    }
};

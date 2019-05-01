import { Action, ENTER_FOLDER, SET_PATH, MOVE_FOLDER_UPWARDS } from "../Actions/actionTypes";


const initialPath: string[] = [];

export const path = (state = initialPath, action: Action<any>): typeof initialPath => {
    switch(action.type) {
        case ENTER_FOLDER:
            return [...state, action.value];
        case MOVE_FOLDER_UPWARDS:
            return action.value > 0 ?
                state.slice(0, -action.value)
                : state;
        case SET_PATH:
            return [...action.value];
        default:
            return state;
    }
};
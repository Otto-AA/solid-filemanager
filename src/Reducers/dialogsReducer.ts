import { DIALOGS, Action, OPEN_DIALOG, CLOSE_DIALOG, OPEN_CONTEXT_MENU, CLOSE_CONTEXT_MENU } from "../Actions/actionTypes";

// Initialize state with values of DIALOGS as keys and false (closed) as value
const initialVisibleDialogs: Record<DIALOGS, boolean> = Object.values(DIALOGS)
    .map((name: DIALOGS) => ({ [name]: false } as Record<DIALOGS, boolean>))
    .reduce((prev, cur) => ({ ...prev, ...cur })) as Record<DIALOGS, boolean>;

export const visibleDialogs = (state = initialVisibleDialogs, action: Action<DIALOGS>): typeof initialVisibleDialogs => {
    switch (action.type) {
        case OPEN_DIALOG:
            return { ...state, [action.value]: true };
        case CLOSE_DIALOG:
            return { ...state, [action.value]: false };
        default:
            return state;
    }
};

const initialContextMenuState = {
    open: false,
    x: 0,
    y: 0,
};

export const contextMenu = (state = initialContextMenuState, action: Action<any>): typeof initialContextMenuState => {
    switch (action.type) {
        case OPEN_CONTEXT_MENU:
            return {
                ...state,
                open: true,
                x: action.value.x,
                y: action.value.y
            };
        case CLOSE_CONTEXT_MENU:
            return { ...state, open: false };
        default:
            return state;
    }
};
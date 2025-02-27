import { Action, TOGGLE_WITH_ACL, TOGGLE_WITH_META } from "../Actions/actionTypes";
import config from "../config";

interface SettingsState {
    withAcl: boolean;
    withMeta: boolean;
}

const initialState: SettingsState = {
    withAcl: config.withAcl(),
    withMeta: config.withMeta(),
};

export const settings = (state = initialState, action: Action<string|null|void>): SettingsState => {
    switch(action.type) {
        case TOGGLE_WITH_ACL:
            config.toggleWithAcl();
            return { ...state, withAcl: config.withAcl() }
        case TOGGLE_WITH_META:
            config.toggleWithMeta();
            return { ...state, withMeta: config.withMeta() }
        default:
            return state;
    }
};

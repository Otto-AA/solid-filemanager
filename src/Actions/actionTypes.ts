export interface Action<V> {
    type: string;
    value: V;
};

export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const ENTER_FOLDER = 'ENTER_FOLDER';
export const MOVE_FOLDER_UPWARDS = 'MOVE_FOLDER_UPWARDS';
export const SET_PATH = 'SET_PATH';

export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const RESET_HOST = 'RESET_HOST';
export const SET_HOST = 'SET_HOST'; // TODO: Consider renaming to BASE_URL
export const RESET_WEB_ID = 'RESET_WEB_ID';
export const SET_WEB_ID = 'SET_WEB_ID';

export const SET_ITEMS = 'SET_ITEMS';

export const SELECT_ITEMS = 'SELECT_ITEMS';
export const TOGGLE_SELECTED_ITEM = 'TOGGLE_SELECTED_ITEM';
export const DESELECT_ITEM = 'DESELECT_ITEM';

export const FILTER_ITEMS = 'FILTER_ITEMS';
export const RESET_FILTER = 'REMOVE_FILTER';

export const DISPLAY_LOADING = 'DISPLAY_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

export const RESET_LOADED_BLOB = 'RESET_LOADED_BLOB';
export const SET_LOADED_BLOB = 'SET_LOADED_BLOB';

export const SET_UPLOAD_FILE_PROGRESS = 'SET_UPLOAD_FILE_PROGRESS';
export const SET_UPLOAD_FILE_LIST = 'SET_UPLOAD_FILE_LIST';

export const OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';
export const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';

export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';

export enum DIALOGS {
    CHOOSE_LOCATION = 'CHOOSE_LOCATION',
    CREATE_FOLDER = 'CREATE_FOLDER',
    CREATE_FILE = 'CREATE_FILE',
    UPLOAD_FILE = 'UPLOAD_FILE',
    RENAME = 'RENAME',
    MOVE = 'MOVE',
    COPY = 'COPY',
    CONTENT = 'CONTENT',
    MEDIA = 'MEDIA',
    EDIT = 'EDIT',
    CONTEXT_MENU = 'CONTEXT_MENU',
};
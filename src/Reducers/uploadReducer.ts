import { Action, SET_UPLOAD_FILE_LIST, SET_UPLOAD_FILE_PROGRESS } from "../Actions/actionTypes";

const initialUploadState = {
    fileList: null as FileList|null,
    progress: 0,
};

export const upload = (state = initialUploadState, action: Action<FileList|number>): typeof initialUploadState => {
    switch(action.type) {
        case SET_UPLOAD_FILE_LIST:
            return { ...state, fileList: action.value as FileList };
        case SET_UPLOAD_FILE_PROGRESS:
            return { ...state, progress: action.value as number };
        default:
            return state;
    }
};

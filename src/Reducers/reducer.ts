import { combineReducers } from 'redux';
import { account } from './accountReducer';
import { blob } from './currentBlobReducer';
import { visibleDialogs, contextMenu } from './dialogsReducer';
import { errorMessage } from './errorReducer';
import { items } from './itemsReducer';
import { loading } from './loadingReducer';
import { path } from './pathReducer';
import { upload } from './uploadReducer';

const rootReducer = combineReducers({
    account,
    blob,
    contextMenu,
    visibleDialogs,
    errorMessage,
    items,
    loading,
    path,
    upload,
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
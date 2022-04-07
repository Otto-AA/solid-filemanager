import * as APIHandler from '../Api/ApiHandler';
import { Item, FileItem, FolderItem } from '../Api/Item';
import { Action, SET_LOGGED_IN, SET_LOGGED_OUT, SET_HOST, SET_ITEMS, SET_WEB_ID, SELECT_ITEMS, TOGGLE_SELECTED_ITEM, DESELECT_ITEM, FILTER_ITEMS, RESET_FILTER, DISPLAY_LOADING, STOP_LOADING, DIALOGS, OPEN_DIALOG, CLOSE_DIALOG, SET_LOADED_BLOB, SET_UPLOAD_FILE_LIST, SET_UPLOAD_FILE_PROGRESS, SET_PATH, MOVE_FOLDER_UPWARDS, RESET_LOADED_BLOB, RESET_HOST, RESET_WEB_ID, SET_ERROR_MESSAGE, OPEN_CONTEXT_MENU, CLOSE_CONTEXT_MENU } from './actionTypes';
import { AppState } from '../Reducers/reducer';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { guessContentType } from '../Api/contentTypes';
import { handleIncomingRedirect, login, logout } from '@inrupt/solid-client-authn-browser';


export type MyThunk = ThunkAction<void, AppState, null, Action<any>>;
export type MyDispatch = ThunkDispatch<AppState, null, Action<any>>;

export const initApp = (): MyThunk => (dispatch, getState) => {
    console.log(`Starting Solid-Filemanager v${process.env.REACT_APP_VERSION}`);
    dispatch(updateLoginStatus());
    dispatch(openDialog(DIALOGS.CHOOSE_LOCATION));
};


export const solidLogin = (oidcIssuer: string): MyThunk => (dispatch, getState) => {
    dispatch(displayLoading());

    login({
        oidcIssuer,
        clientName: 'Solid File Manager',
        redirectUrl: window.location.href,
    });
};

export const updateLoginStatus = (): MyThunk => async (dispatch, getState) => {
    handleIncomingRedirect({ restorePreviousSession: true })
        .then(session => {
            console.log('handleIncomingRequest', session)
            if (session && session.isLoggedIn && session.webId) {
                dispatch(setLoggedIn());
                dispatch(setWebId(session.webId))
            } else {
                dispatch(setLoggedOut());
                dispatch(resetWebId())
            }
        })
}

export const solidLogout = (): MyThunk => (dispatch, getState) => {
    dispatch(displayLoading());

    logout()
        .then(() => {
            dispatch(resetPath());
            dispatch(resetItems());
            dispatch(resetSelectedItems());
            dispatch(setLoggedOut());
            dispatch(resetWebId());

            dispatch(openDialog(DIALOGS.CHOOSE_LOCATION));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

export const clearCache = (): MyThunk => (dispatch, getState) => APIHandler.clearCache();


/**
 * Request API to get file list for the selected path then refresh UI
 */
export const uploadFiles = (): MyThunk => (dispatch, getState) => {
    const { path, upload: { fileList } } = getState();

    if (fileList === null)
        return dispatch(setErrorMessage("Couldn't find files to upload"));

    dispatch(displayLoading());
    dispatch(resetSelectedItems());
    dispatch(setFileUploadProgress(50));

    APIHandler.uploadFiles(path.join('/'), fileList)
        .then(r => {
            dispatch(setFileUploadProgress(100));
            setTimeout(f => {
                dispatch(resetFileUploader());
            }, 300);
            dispatch(displayCurrentItemList());
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


export const createFile = (fileName: string, contentType?: string): MyThunk => async (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    contentType = contentType ? contentType : await guessContentType(fileName);
    APIHandler.updateFile(path.join('/'), fileName, new Blob(), contentType)
        .then(r => {
            dispatch(closeDialog(DIALOGS.CREATE_FILE));
            dispatch(displayCurrentItemList());
            dispatch(loadAndEditFile(fileName));
            return APIHandler.getItemList(path.join('/'));
        })
        .then(itemList => itemList.find(item => item.getDisplayName() === fileName))
        .then(item => {
            if (!item)
                throw new Error("Couldn't load created file for editing");
            dispatch(selectItem(item));
            dispatch(getFileContent(item.name));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

export const updateTextFile = (fileName: string, content: Blob|string, contentType?: string): MyThunk => async (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    contentType = contentType ? contentType : await guessContentType(fileName, content);
    APIHandler.updateFile(path.join('/'), fileName, content, contentType)
        .then(r => {
            dispatch(closeDialog(DIALOGS.EDIT));
            dispatch(displayCurrentItemList());
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
}

/**
 * Request API to display file list for the selected path
 */
export const displayCurrentItemList = (): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());
    dispatch(resetSelectedItems());
    APIHandler.getItemList(path.join('/'))
        .then(items => dispatch(setItems(items)))
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

/**
 * Request API to reload the file list and then refresh UI
 */
export const refreshItemList = (): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    APIHandler.clearCacheForFolder(path.join('/'));
    return dispatch(displayCurrentItemList());
};


/**
 * Request API to rename file then dispatch defined events
 */
export const renameFile = (fileName: string, newFileName: string): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    APIHandler.renameFile(path.join('/'), fileName, newFileName)
        .then(() => {
            dispatch(displayCurrentItemList());
            dispatch(closeDialog(DIALOGS.RENAME));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

/**
 * Request API to rename file then dispatch defined events
 */
export const renameFolder = (folderName: string, newFolderName: string): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    APIHandler.renameFolder(path.join('/'), folderName, newFolderName)
        .then(() => {
            dispatch(displayCurrentItemList());
            dispatch(closeDialog(DIALOGS.RENAME));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

/**
 * Request API to download the specified items
 */
export const downloadItems = (items: Item[]): MyThunk => async (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    try {
        let blob;
        let downloadName = items[0].name;
        if (items.length === 1 && items[0] instanceof FileItem) {
            blob = await APIHandler.getFileBlob(path.join('/'), items[0].name);
        }
        else {
            const zip = await APIHandler.getAsZip(path.join('/'), items);
            blob = await zip.generateAsync({ type: 'blob' });

            if (items.length > 1)
                downloadName = 'Archive';
            downloadName = `${downloadName}.zip`;
        }

        promptDownload(blob, downloadName);
    }
    catch (e) {
        dispatch(setErrorMessage(String(e)));
    }
    dispatch(stopLoading());
};

/**
 * Request API to upload the items as zip archive
 */
export const zipAndUpload = (items: Item[]): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    const archiveName = (items.length === 1 && items[0] instanceof FolderItem) ?
        `${items[0].name}.zip`
        : 'Archive.zip';

    APIHandler.getAsZip(path.join('/'), items)
        .then(zip => zip.generateAsync({ type: 'blob' }))
        .then(blob => APIHandler.updateFile(path.join('/'), archiveName, blob, 'application/zip'))
        .then(() => dispatch(displayCurrentItemList()))
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

/**
 * Request API for extracting a zip archive
 */
export const extractZipFile = (fileName: string): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    APIHandler.extractZipArchive(path.join('/'), path.join('/'), fileName)
        .then(r => dispatch(displayCurrentItemList()))
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};

// code based on https://stackoverflow.com/a/30832210/6548154
function promptDownload(file: Blob, fileName: string) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fileName);
    else { // Others
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

/**
 * Opens the item in a new tab
 */
export const openInNewTab = (item: Item): MyThunk => (dispatch, getState) => {
    window.open(item.url, '_blank');
};


/**
 * Request API to get file content then dispatch defined events
 */
export const getFileContent = (fileName: string): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());
    dispatch(resetFileContent());

    APIHandler.getFileBlob(path.join('/'), fileName)
        .then(blob => dispatch(setFileContent(blob)))
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


/**
 * Request API to get file content and open the edit dialogue
 */
export const loadAndEditFile = (fileName: string): MyThunk => (dispatch, getState) => {
    dispatch(getFileContent(fileName));
    dispatch(openDialog(DIALOGS.EDIT));
};


/**
 * Request API to get file content and display it
 */
export const loadAndDisplayFile = (fileName: string): MyThunk => (dispatch, getState) => {
    dispatch(getFileContent(fileName));
    dispatch(openDialog(DIALOGS.CONTENT));
};


/**
 * Request API to display an audio or video file
 */
export const displaySelectedMediaFile = (): MyThunk => (dispatch, getState) => {
    dispatch(openDialog(DIALOGS.MEDIA));
};


/**
 * Request API to create a folder then dispatch defined events
 */
export const createNewFolder = (folderName: string): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    APIHandler.createFolder(path.join('/'), folderName)
        .then(r => {
            dispatch(displayCurrentItemList());
            dispatch(closeDialog(DIALOGS.CREATE_FOLDER));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


/**
 * Request API to remove multiple items
 */
export const removeItems = (items: Item[]): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    const itemNames = items.map(f => f.name);

    APIHandler.removeItems(path.join('/'), itemNames)
        .then(r => dispatch(displayCurrentItemList()))
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


/**
 * Request API to move multiple items
 */
export const moveItems = (items: Item[], { host, path: targetPath }: { host: string, path: string[] }): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());


    const destination = targetPath.join('/');
    const itemNames = items.map(f => f.name);

    APIHandler.moveItems(path.join('/'), destination, itemNames)
        .then(r => {
            dispatch(displayCurrentItemList());
            dispatch(closeDialog(DIALOGS.MOVE));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


/**
 * Request API to copy an item then dispatch defined events
 */
export const copyItems = (items: Item[], { host, path: targetPath }: { host: string, path: string[] }): MyThunk => (dispatch, getState) => {
    const { path } = getState();
    dispatch(displayLoading());

    const destination = targetPath.join('/');
    const itemNames = items.map(f => f.name);

    APIHandler.copyItems(path.join('/'), destination, itemNames)
        .then(r => {
            dispatch(displayCurrentItemList());
            dispatch(closeDialog(DIALOGS.COPY));
        })
        .catch(r => dispatch(setErrorMessage(String(r))))
        .finally(() => dispatch(stopLoading()));
};


/**
 * This handles multiple selection by using shift key
 */
export const setSelectedItemsFromLastTo = (lastFile: Item): MyThunk => (dispatch, getState) => {
    const { items: { inCurFolder: items, selected: selectedItems } } = getState();

    const lastPreviouslySelected = [...selectedItems].pop();
    if (!lastPreviouslySelected)
        return dispatch(setErrorMessage("Couldn't enlarge selection because no items were previously selected"));

    const lastPreviouslySelectedIndex = items.indexOf(lastPreviouslySelected);
    const lastSelectedIndex = items.indexOf(lastFile);

    const isInRange = (num: number, start: number, end: number) => start <= num && num <= end;
    const toAdd = lastSelectedIndex > lastPreviouslySelectedIndex ?
        items.filter((item, index) => isInRange(index, lastPreviouslySelectedIndex, lastSelectedIndex))
        : items.filter((item, index) => isInRange(index, lastSelectedIndex, lastPreviouslySelectedIndex));

    dispatch(selectItems([...selectedItems, ...toAdd]));
};

export const resetFileUploader = (): MyThunk => (dispatch, getState) => {
    dispatch(setFileUploadProgress(0));
    dispatch(closeDialog(DIALOGS.UPLOAD_FILE));
    dispatch(resetFileUploadList());
};


export const enterFolder = (path: string[]): MyThunk => (dispatch, getState) => {
    dispatch(setPath(path));
    dispatch(resetFilter());
    dispatch(displayCurrentItemList());
};

export const enterFolderByItem = (item: Item): MyThunk => (dispatch, getState) => {
    const path = item.path;
    // Open containing folder if it is a file
    dispatch(enterFolder(item instanceof FileItem ? path : [...path, item.name]));
};

export const moveFolderUpwardsAndRefresh = (n: number): MyThunk => (dispatch, getState) => {
    dispatch(moveFolderUpwards(n));
    dispatch(refreshItemList());
};

export const rightClickOnFile = (item: Item): MyThunk => (dispatch, getState) => {
    const { items: { selected } } = getState();
    const isSelected = selected.includes(item);

    !isSelected && dispatch(selectItem(item));
};


// Create action which can be dispatched
const makeActionCreator: <VALUE=void>(type: string) => (value: VALUE) => Action<VALUE> = <VALUE=void>(type: string) => (value: VALUE) => {
    return {
        type,
        value
    };
};

export const moveFolderUpwards = makeActionCreator<number>(MOVE_FOLDER_UPWARDS);
export const setPath = makeActionCreator<string[]>(SET_PATH);
export const resetPath = () => setPath([]);

export const setLoggedIn = makeActionCreator(SET_LOGGED_IN);
export const setLoggedOut = makeActionCreator(SET_LOGGED_OUT);
export const setHost = makeActionCreator<string>(SET_HOST);
export const resetHost = makeActionCreator(RESET_HOST);
export const setWebId = makeActionCreator<string>(SET_WEB_ID);
export const resetWebId = makeActionCreator(RESET_WEB_ID);

export const setItems = makeActionCreator<Item[]>(SET_ITEMS);
export const resetItems = () => setItems([]);

export const selectItems = makeActionCreator<Item[]>(SELECT_ITEMS);
export const selectItem = (item: Item) => selectItems([item]);
export const resetSelectedItems = () => selectItems([]);
export const toggleSelectedItem = makeActionCreator<Item>(TOGGLE_SELECTED_ITEM);
export const deselectItem = makeActionCreator<Item>(DESELECT_ITEM);

export const filterItems = makeActionCreator<string>(FILTER_ITEMS);
export const resetFilter = makeActionCreator(RESET_FILTER);


export const displayLoading = makeActionCreator(DISPLAY_LOADING);
export const stopLoading = makeActionCreator(STOP_LOADING);

export const resetFileContent = makeActionCreator(RESET_LOADED_BLOB);
export const setFileContent = makeActionCreator<Blob>(SET_LOADED_BLOB);
export const setFileUploadList = makeActionCreator<FileList|null>(SET_UPLOAD_FILE_LIST);
export const resetFileUploadList = () => setFileUploadList(null);
export const setFileUploadProgress = makeActionCreator<number>(SET_UPLOAD_FILE_PROGRESS);

export const openDialog = makeActionCreator<DIALOGS>(OPEN_DIALOG);
export const closeDialog = makeActionCreator<DIALOGS>(CLOSE_DIALOG);
export const openContextMenu = makeActionCreator<{ x: number, y: number }>(OPEN_CONTEXT_MENU);
export const closeContextMenu = makeActionCreator(CLOSE_CONTEXT_MENU);

export const setErrorMessage = makeActionCreator<string>(SET_ERROR_MESSAGE);
export const resetErrorMessage = () => setErrorMessage('');

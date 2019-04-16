import * as APIHandler from '../Api/ApiHandler.js';
import * as solidAuth from 'solid-auth-client';
import { createBrowserHistory } from 'history';
// eslint-disable-next-line no-unused-vars
import { Item, FileItem, FolderItem } from '../Api/Item.js';

export const initApp = () => (dispatch, getState) => {
    dispatch(initBrowserHistory());
    dispatch(updateLoginStatus());
    dispatch(setVisibleDialogChooseLocation(true));
};

// Note: This doesn't seem like a good way to handle this, but it's the best I've come up with for now.
// Feel free to change in the future
let history;
export const initBrowserHistory = () => (dispatch, getState) => {
	history = createBrowserHistory();
	history.listen((location, action) => {
		if (action === 'POP') {
            let host, path;
            if (location && typeof location.state !== typeof undefined) {
                ({ host, path } = location.state);
            }
            else {
                const params = new URLSearchParams(location.search.substr(1));
                const url = params.get('url');
                if (url !== null) {
                    ({ host, path } = getLocationObjectFromUrl(url));
                }
            }
            dispatch(setHost(host));
            dispatch(enterFolderWithoutUpdatingHistory(path));
		}
	});
};
export const updateBrowserHistory = () => (dispatch, getState) => {
    const { host, path } = getState();
    const url = `${host}/${path.join('/')}`;
	history.push(`?url=${encodeURI(url)}`, { host, path });
}

export const getLocationObjectFromUrl = (url) => {
    url = new URL(url);
    const host = url.origin;
    const path = url.pathname.split('/').filter(val => val !== '');

    return {
        host,
        path
    };
}

export const solidLogin = () => (dispatch, getState) => {
    dispatch(setLoading(true));

    solidPopupLogin().then(({ webId }) => {
        dispatch(setWebId(webId));
        dispatch(setIsLoggedIn(true));
        dispatch(setLoading(false));
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

export const updateLoginStatus = () => async (dispatch, getState) => {
    const session = await solidAuth.currentSession();
    if (!session) {
        dispatch(setIsLoggedIn(false));
        dispatch(setWebId(null));
    }
    else {
        dispatch(setWebId(session.webId));
        dispatch(setIsLoggedIn(true));
    }
}

async function solidPopupLogin() {
    return solidAuth.popupLogin({ popupUri: './vendor/solid-auth-client/popup.html' });
}


export const solidLogout = () => (dispatch, getState) => {
    dispatch(setLoading(true));

    solidAuth.logout().then(() => {
        dispatch(setPath([]));
        dispatch(setPathSublist([]));
        dispatch(setItemList([]));
        dispatch(setSelectedItems([]));
        dispatch(setIsLoggedIn(false));
        dispatch(setWebId(null));
        dispatch(setVisibleDialogChooseLocation(true));
        dispatch(setLoading(false));
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

export const clearCache = () => (disptach, getState) => APIHandler.clearCache();


/**
 * Request API to get file list for the selected path then refresh UI
 * @returns {Function}
 */
export const uploadFiles = (fileList) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setSelectedItems([]));
    dispatch(setFileUploadProgress(50));

    APIHandler.uploadFiles(path.join('/'), fileList).then(r => {
        dispatch(setFileUploadProgress(100));
        setTimeout(f => {
            dispatch(resetFileUploader());
        }, 300);
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


export const createFile = (fileName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));

    APIHandler.updateFile(path.join('/'), fileName, '').then(r => {
        dispatch(setVisibleDialogCreateFile(false));
        dispatch(displayCurrentItemList());

        APIHandler.getItemList(path.join('/')).then(itemList => {
            const item = itemList.find(item => item.name === fileName || item.name === encodeURI(fileName));
            dispatch(setSelectedItems([item]));
            dispatch(getFileContent(item.name));
            dispatch(setVisibleDialogEdit(true));
        });
    });
};


export const updateTextFile = (fileName, content) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));

    APIHandler.updateFile(path.join('/'), fileName, content).then(r => {
        dispatch(setVisibleDialogEdit(false));
        dispatch(displayCurrentItemList());
        dispatch(setLoading(false));
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
}

/**
 * Request API to get file list for the selected path then refresh UI
 * @returns {Function}
 */
export const displayCurrentItemList = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setSelectedItems([]));
    APIHandler.getItemList(path.join('/')).then(items => {
        dispatch(setLoading(false));
        dispatch(setItemList(items));
    }).catch(r => {
        dispatch(setItemList([]));
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

/**
 * Request API to reload the file list and then refresh UI
 */
export const refreshItemList = () => (dispatch, getState) => {
    const { path } = getState();
    APIHandler.clearCacheForFolder(path.join('/'));
    return dispatch(displayCurrentItemList());
};


/**
 * Request API to get file list for the selected path then refresh UI
 * @returns {Function}
 */
export const updateItemListSublist = () => (dispatch, getState) => {
    const { pathSublist } = getState();
    dispatch(setLoadingSublist(true));
    dispatch(setSelectedFolderSublist(null));

    APIHandler.getItemList(pathSublist.join('/')).then(r => {
        dispatch(setLoadingSublist(false));
        dispatch(setItemListSublist(r));
    }).catch(r => {
        dispatch(setItemListSublist([]));
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoadingSublist(false));
    });
};


/**
 * Request API to rename file then dispatch defined events
 * @param {String} fileName
 * @returns {Function}
 */
export const renameFile = (fileName, newFileName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    APIHandler.renameFile(path.join('/'), fileName, newFileName).then(blob => {
        dispatch(setVisibleDialogRename(false));
        dispatch(setLoading(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

/**
 * Request API to rename file then dispatch defined events
 * @param {String} folderName
 * @param {String} newFolderName
 * @returns {Function}
 */
export const renameFolder = (folderName, newFolderName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    APIHandler.renameFolder(path.join('/'), folderName, newFolderName).then(blob => {
        dispatch(setVisibleDialogRename(false));
        dispatch(setLoading(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

/**
 * Request API to download the specified items
 * @param {Array<Object>} itemList
 * @returns {Function}
 */
export const downloadItems = (itemList) => async (dispatch, getState) => {
    const { path } = getState();

    dispatch(setLoading(true));
    try {
        let blob;
        let downloadName = itemList[0].name;
        if (itemList.length === 1 && itemList[0] instanceof FileItem) {
            blob = await APIHandler.getFileBlob(path.join('/'), itemList[0].name);
        }
        else {
            const zip = await APIHandler.getAsZip(path.join('/'), itemList);
            blob = await zip.generateAsync({ type: 'blob' });

            if (itemList.length > 1)
                downloadName = 'Archive';
            downloadName = `${downloadName}.zip`;
        }

        promptDownload(blob, downloadName);
        dispatch(setLoading(false));
    }
    catch (e) {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: e.toString()
        });
        dispatch(setLoading(false));
    }
};

/**
 * Request API to upload the items as zip archive
 * @param {Array<Object>} itemList
 * @returns {Function}
 */
export const zipAndUpload = (itemList) => (dispatch, getState) => {
    const { path } = getState();
    const archiveName = (itemList.length === 1 && itemList[0] instanceof FolderItem) ? `${itemList[0].name}.zip` : 'Archive.zip';

    dispatch(setLoading(true));
    APIHandler.getAsZip(path.join('/'), itemList)
        .then(zip => zip.generateAsync({ type: 'blob' }))
        .then(blob => APIHandler.updateFile(path.join('/'), archiveName, blob))
        .then(() => {
            dispatch(setLoading(false));
            dispatch(displayCurrentItemList());
        })
        .catch(r => {
            dispatch({
                type: 'SET_ERROR_MSG',
                value: r.toString()
            });
            dispatch(setLoading(false));
        });
};

/**
 * Request API for extracting a zip archive
 * @param {String} fileName
 * @returns {Function}
 */
export const extractZipFile = (fileName) => (dispatch, getState) => {
    const { path } = getState();

    dispatch(setLoading(true));
    APIHandler.extractZipArchive(path.join('/'), path.join('/'), fileName).then(r => {
        dispatch(setLoading(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

// code from https://stackoverflow.com/a/30832210/6548154
function promptDownload(file, fileName) {
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
 * @param {Item} item 
 */
export const openInNewTab = (item) => (dispatch, getState) => {
    window.open(item.url, '_blank');
};


/**
 * Request API to get file content then dispatch defined events
 * @param {String} fileName
 * @returns {Function}
 */
export const getFileContent = (fileName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setFileContent(null));
    APIHandler.getFileBlob(path.join('/'), fileName).then(blob => {
        dispatch(setFileContent(blob));
        dispatch(setLoading(false));
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * Request API to get file content and open the edit dialogue
 * @param {String} fileName
 * @returns {Function} 
 */
export const loadAndEditFile = (fileName) => (dispatch, getState) => {
    dispatch(getFileContent(fileName));
    dispatch(setVisibleDialogEdit(true));
};


/**
 * Request API to get file content and display it
 * @param {String} fileName
 * @returns {Function} 
 */
export const loadAndDisplayFile = (fileName) => (dispatch, getState) => {
    dispatch(getFileContent(fileName));
    dispatch(setVisibleDialogContent(true));
};


/**
 * Request API to display an audio or video file
 * @returns {Function}
 */
export const displaySelectedMediaFile = () => (dispatch, getState) => {
    dispatch(setVisibleDialogMedia(true));
};


/**
 * Request API to create a folder then dispatch defined events
 * @param {String} createFolderName
 * @returns {Function}
 */
export const createNewFolder = (createFolderName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));

    APIHandler.createFolder(path.join('/'), createFolderName).then(r => {
        dispatch(setVisibleDialogCreateFolder(false));
        dispatch(setLoading(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * Request API to remove an item then dispatch defined events
 * @param {Array<Item>} items
 * @returns {Function}
 */
export const removeItems = (items) => (dispatch, getState) => {
    const { path } = getState();
    const itemNames = items.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.removeItems(path.join('/'), itemNames).then(r => {
        dispatch(setLoading(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * Request API to move an item then dispatch defined events
 * @param {Array<Item>} items
 * @returns {Function}
 */
export const moveItems = (items) => (dispatch, getState) => {
    const { path, pathSublist, selectedFolderSublist } = getState();
    const destination = pathSublist.join('/') + '/' + selectedFolderSublist.name;
    const itemNames = items.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.moveItems(path.join('/'), destination, itemNames).then(r => {
        dispatch(setLoading(false));
        dispatch(setVisibleDialogMove(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * Request API to copy an item then dispatch defined events
 * @param {Array<Item>} items
 * @returns {Function}
 */
export const copyItems = (items) => (dispatch, getState) => {
    const { path, pathSublist, selectedFolderSublist } = getState();
    const destination = pathSublist.join('/') + '/' + selectedFolderSublist.name;
    const itemNames = items.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.copyItems(path.join('/'), destination, itemNames).then(r => {
        dispatch(setLoading(false));
        dispatch(setVisibleDialogCopy(false));
        dispatch(displayCurrentItemList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * This handles multiple selection by using shift key
 * @param {Object} lastFile
 * @returns {Function}
 */
export const setSelectedFileFromLastTo = (lastFile) => (dispatch, getState) => {
    const { itemList, selectedItems } = getState();

    const lastPreviouslySelected = [...selectedItems].pop();
    const lastPreviouslySelectedIndex = itemList.indexOf(itemList.find(f => f.name === lastPreviouslySelected.name))
    const lastSelectedIndex = itemList.indexOf(itemList.find(f => f.name === lastFile.name))

    let toAdd = [];
    if (lastSelectedIndex > lastPreviouslySelectedIndex) {
        toAdd = itemList.filter((index, element) => {
            return itemList.indexOf(index) <= lastSelectedIndex && itemList.indexOf(index) >= lastPreviouslySelectedIndex
        });
    } else {
        toAdd = itemList.filter((index, element) => {
            return itemList.indexOf(index) >= lastSelectedIndex && itemList.indexOf(index) <= lastPreviouslySelectedIndex
        });
    }
    dispatch(setSelectedItems([...selectedItems, ...toAdd]));
};


/**
 * @returns {Function}
 */
export const initSubList = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setSelectedFolderSublist(null));
    dispatch(setItemListSublist([]));
    dispatch(setPathSublist([...path]));
    dispatch(updateItemListSublist());
};

export const resetFileUploader = () => (dispatch, getState) => {
    dispatch(setFileUploadProgress(0));
    dispatch(setVisibleDialogUploadFile(false));
    dispatch(setFileUploadList([]));
};


export const enterFolder = (path) => (dispatch, getState) => {
    dispatch(enterFolderWithoutUpdatingHistory(path));
    dispatch(updateBrowserHistory());
};

export const enterFolderByItem = (item) => (dispatch, getState) => {
    const path = item.path;
    // Open containing folder if it is a file
    dispatch(enterFolderWithoutUpdatingHistory(item instanceof FileItem ? path : [...path, item.name]));
    dispatch(updateBrowserHistory());
};

export const enterFolderWithoutUpdatingHistory = (path) => (dispatch, getState) => {
    dispatch(setPath(path));
    dispatch(setFileListFilter(null));
    dispatch(displayCurrentItemList());
};

export const enterToPreviousDirectory = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(enterFolder(path.slice(0, -1)));
};

export const enterToPreviousDirectoryByIndex = (index) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(enterFolder([...path].slice(0, ++index)));
};

export const enterToPreviousDirectorySublist = () => (dispatch, getState) => {
    const { pathSublist } = getState();
    dispatch(setPathSublist(pathSublist.slice(0, -1)));
    dispatch(updateItemListSublist());
};

export const setPath = (path) => {
    return {
        type: 'SET_PATH',
        value: path
    };
};

export const setPathSublist = (path) => {
    return {
        type: 'SET_PATH_SUB_LIST',
        value: path
    };
};

export const setHost = (host) => {
    return {
        type: 'SET_HOST',
        value: host
    };
};

export const setIsLoggedIn = (isLoggedIn) => {
    return {
        type: 'SET_IS_LOGGED_IN',
        value: isLoggedIn
    };
};

export const setWebId = (webId) => {
    return {
        type: 'SET_WEB_ID',
        value: webId
    };
};

export const enterToDirectorySublist = (directory) => (dispatch, getState) => {
    dispatch({
        type: 'ENTER_TO_DIRECTORY_SUB_LIST',
        value: directory
    });
    dispatch(updateItemListSublist());
};

export const setItemList = (itemList) => {
    return {
        type: 'SET_ITEM_LIST',
        value: itemList
    };
};

export const setItemListSublist = (itemList) => {
    return {
        type: 'SET_ITEM_LIST_SUB_LIST',
        value: itemList
    };
};

export const setSelectedItems = (items) => {
    return {
        type: 'SET_SELECTED_ITEMS',
        value: items
    };
};

export const setSelectedFolderSublist = (file) => {
    return {
        type: 'SET_SELECTED_FOLDER_SUB_LIST',
        value: file
    };
};

export const setFileListFilter = (search) => {
    return {
        type: 'SET_FILE_LIST_FILTER',
        value: search
    };
};

export const setContextMenuVisible = (visible) => {
    return {
        type: 'SET_CONTEXT_MENU_VISIBLE',
        value: !!visible
    };
};

export const setContextMenuPosition = (x, y) => {
    return {
        type: 'SET_CONTEXT_MENU_POSITION',
        value: [x, y]
    };
};

export const setContextMenuPositionElement = (element) => {
    return {
        type: 'SET_CONTEXT_MENU_POSITION_ELEMENT',
        value: element
    };
};

export const toggleSelectedFile = (file) => {
    return {
        type: 'TOGGLE_SELECTED_FILE',
        value: file
    };
};

export const rightClickOnFile = (item) => (dispatch, getState) => {
    const { selectedItems } = getState();
    const isSelected = selectedItems.indexOf(selectedItems.find(f => f.name === item.name)) !== -1;

    !isSelected && dispatch(setSelectedItems([item]));
};

export const setLoading = (value) => {
    return {
        type: 'SET_LOADING',
        value: value
    };
};

export const setLoadingSublist = (value) => {
    return {
        type: 'SET_LOADING_SUB_LIST',
        value: value
    };
};

export const setVisibleDialogChooseLocation = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_CHOOSE_LOCATION',
        value: !!visible
    };
};

export const setVisibleDialogCreateFolder = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_CREATE_FOLDER',
        value: !!visible
    };
};

export const setVisibleDialogCreateFile = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_CREATE_FILE',
        value: !!visible
    };
};

export const setVisibleDialogUploadFile = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_UPLOAD_FILE',
        value: !!visible
    };
};

export const setVisibleDialogRename = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_RENAME',
        value: !!visible
    };
};

export const setVisibleDialogMove = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_MOVE',
        value: !!visible
    };
};

export const setVisibleDialogCopy = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_COPY',
        value: !!visible
    };
};

export const setVisibleDialogContent = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_CONTENT',
        value: !!visible
    };
};

export const setVisibleDialogMedia = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_MEDIA',
        value: !!visible
    };
};

export const setVisibleDialogEdit = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_EDIT',
        value: !!visible
    };
};

export const setFileContent = (blob) => {
    return {
        type: 'SET_FILE_CONTENT',
        value: blob
    };
};

export const setFileUploadProgress = (percentage) => {
    return {
        type: 'SET_FILE_UPLOAD_PROGRESS',
        value: percentage
    };
};

export const setFileUploadList = (files) => {
    return {
        type: 'SET_FILE_UPLOAD_LIST',
        value: files
    };
};

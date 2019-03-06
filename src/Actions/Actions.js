import * as APIHandler from '../Api/ApiHandler.js';
import * as solidAuth from 'solid-auth-client';
import config from '../config.js';


export const solidLogin = () => (dispatch, getState) => {
    dispatch(setLoading(true));

    solidPopupLogin().then(webId => {
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

async function solidPopupLogin() {
    let session = await solidAuth.currentSession();
    if (!session) {
        let popupUri = 'https://solid.community/common/popup.html';
        session = await solidAuth.popupLogin({ popupUri });
    }
    return(session.webId);
}


export const solidLogout = () => (dispatch, getState) => {
    dispatch(setLoading(true));

    solidAuth.logout().then(() => {
        // TODO: Add reset method
        dispatch(setPath([]));
        dispatch(setPathSublist([]));
        dispatch(setFileList([]));
        dispatch(setSelectedFiles([]));
        dispatch(setVisibleDialogSolidLogout(false));
        dispatch(setVisibleDialogSolidLogin(true));
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
 * Request API to get file list for the selected path then refresh UI
 * @returns {Function}
 */
export const uploadFiles = (fileList) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setSelectedFiles([]));
    dispatch(setFileUploadProgress(50));

    APIHandler.uploadFiles(path.join('/'), fileList).then(r => {
        dispatch(setFileUploadProgress(100));
        setTimeout(f => {
            dispatch(resetFileUploader());
        }, 300);
        dispatch(refreshFileList());
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

    APIHandler.updateTextFile(path.join('/'), fileName, '').then(r => {
        dispatch(setVisibleDialogCreateFile(false));
        dispatch(refreshFileList());

        APIHandler.getItemList(path.join('/')).then(itemList => {
            const file = itemList.find(item => item.name === fileName || item.name === encodeURI(fileName));
            dispatch(setSelectedFiles([file]));
            dispatch(setLoading(false));
            dispatch(setVisibleDialogEdit(true));
        });
    });
};


export const updateTextFile = (fileName, content) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));

    APIHandler.updateTextFile(path.join('/'), fileName, content).then(r => {
        dispatch(setVisibleDialogEdit(false));
        dispatch(refreshFileList());
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
export const refreshFileList = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setSelectedFiles([]));
    APIHandler.getItemList(path.join('/')).then(r => {
        dispatch(setLoading(false));
        dispatch(setFileList(r));
    }).catch(r => {
        dispatch(setFileList([]));
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};


/**
 * Request API to get file list for the selected path then refresh UI
 * @returns {Function}
 */
export const refreshFileListSublist = () => (dispatch, getState) => {
    const { pathSublist } = getState();
    dispatch(setLoadingSublist(true));
    dispatch(setSelectedFolderSublist(null));

    APIHandler.getItemList(pathSublist.join('/')).then(r => {
        dispatch(setLoadingSublist(false));
        dispatch(setFileListSublist(r));
    }).catch(r => {
        dispatch(setFileListSublist([]));
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoadingSublist(false));
    });
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
    dispatch(setVisibleDialogContent(true));
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
        dispatch(refreshFileList());
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
        dispatch(refreshFileList());
    }).catch(r => {
        dispatch({
            type: 'SET_ERROR_MSG',
            value: r.toString()
        });
        dispatch(setLoading(false));
    });
};

/**
 * Request API to get download file then dispatch defined events
 * @param {String} fileName
 * @returns {Function}
 */
export const downloadFile = (fileName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    APIHandler.getFileBlob(path.join('/'), fileName).then(blob => {
        promptDownload(blob, fileName);
        dispatch(setLoading(false));
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


export const openInNewTab = (fileName) => (dispatch, getState) => {
    const { path } = getState();
    const url = `${config.getHost()}/${path.length ? (path.join('/') + '/') : ''}${fileName}`;
    window.open(url, '_blank');
};


/**
 * Request API to get file content then dispatch defined events
 * @param {String} fileName
 * @returns {Function}
 */
export const getFileContentForEdit = (fileName) => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setLoading(true));
    dispatch(setFileContent(null));
    dispatch(setVisibleDialogEdit(true));
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
        dispatch(refreshFileList());
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
 * @param {Array} filenames
 * @returns {Function}
 */
export const removeItems = (files) => (dispatch, getState) => {
    const { path } = getState();
    const filenames = files.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.removeItems(path.join('/'), filenames).then(r => {
        dispatch(setLoading(false));
        dispatch(refreshFileList());
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
 * @param {Array} filenames
 * @returns {Function}
 */
export const moveItems = (files) => (dispatch, getState) => {
    const { path, pathSublist, selectedFolderSublist } = getState();
    const destination = pathSublist.join('/') + '/' + selectedFolderSublist.name;
    const filenames = files.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.moveItems(path.join('/'), destination, filenames).then(r => {
        dispatch(setLoading(false));
        dispatch(setVisibleDialogMove(false));
        dispatch(refreshFileList());
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
 * @param {Array} filenames
 * @returns {Function}
 */
export const copyItems = (files) => (dispatch, getState) => {
    const { path, pathSublist, selectedFolderSublist } = getState();
    const destination = pathSublist.join('/') + '/' + selectedFolderSublist.name;
    const filenames = files.map(f => f.name);

    dispatch(setLoading(true));
    APIHandler.copyItems(path.join('/'), destination, filenames).then(r => {
        dispatch(setLoading(false));
        dispatch(setVisibleDialogCopy(false));
        dispatch(refreshFileList());
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
    const { fileList, selectedFiles } = getState();

    const lastPreviouslySelected = [...selectedFiles].pop();
    const lastPreviouslySelectedIndex = fileList.indexOf(fileList.find(f => f.name === lastPreviouslySelected.name))
    const lastSelectedIndex = fileList.indexOf(fileList.find(f => f.name === lastFile.name))

    let toAdd = [];
    if (lastSelectedIndex > lastPreviouslySelectedIndex) {
        toAdd = fileList.filter((index, element) => {
            return fileList.indexOf(index) <= lastSelectedIndex && fileList.indexOf(index) >= lastPreviouslySelectedIndex
        });
    } else {
        toAdd = fileList.filter((index, element) => {
            return fileList.indexOf(index) >= lastSelectedIndex && fileList.indexOf(index) <= lastPreviouslySelectedIndex
        });
    }
    dispatch(setSelectedFiles([...selectedFiles, ...toAdd]));
};


/**
 * @returns {Function}
 */
export const initSubList = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setSelectedFolderSublist(null));
    dispatch(setFileListSublist([]));    
    dispatch(setPathSublist([...path]));
    dispatch(refreshFileListSublist());
};

export const resetFileUploader = () => (dispatch, getState) => {
    dispatch(setFileUploadProgress(0));
    dispatch(setVisibleDialogUploadFile(false));
    dispatch(setFileUploadList([]));
};

export const enterToPreviousDirectory = () => (dispatch, getState) => {
    const { path } = getState();
    dispatch(setPath(path.slice(0, -1)));
    dispatch(setFileListFilter(null));
    dispatch(refreshFileList());
};

export const enterToPreviousDirectoryByIndex = (index) => (dispatch, getState) => {
    const { path } = getState();
    const newPath = [...path].slice(0, ++index);
    dispatch(setPath(newPath));
    dispatch(refreshFileList());
    dispatch(setFileListFilter(null));
};

export const enterToPreviousDirectorySublist = () => (dispatch, getState) => {
    const { pathSublist } = getState();
    dispatch(setPathSublist(pathSublist.slice(0, -1)));
    dispatch(refreshFileListSublist());
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

export const enterToDirectory = (directory) => (dispatch, getState) => {
    dispatch({
        type: 'ENTER_TO_DIRECTORY',
        value: directory
    });
    dispatch(setFileListFilter(null));
    dispatch(refreshFileList());
};

export const enterToDirectorySublist = (directory) => (dispatch, getState) => {
    dispatch({
        type: 'ENTER_TO_DIRECTORY_SUB_LIST',
        value: directory
    });
    dispatch(refreshFileListSublist());
};

export const setFileList = (fileList) => {
    return {
        type: 'SET_FILE_LIST',
        value: fileList
    };
};

export const setFileListSublist = (fileList) => {
    return {
        type: 'SET_FILE_LIST_SUB_LIST',
        value: fileList
    };
};

export const setSelectedFiles = (files) => {
    return {
        type: 'SET_SELECTED_FILES',
        value: files
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

export const rightClickOnFile = (file) => (dispatch, getState) => {
    const { selectedFiles } = getState();
    const isSelected = selectedFiles.indexOf(selectedFiles.find(f => f.name === file.name)) !== -1;

    !isSelected && dispatch(setSelectedFiles([file]));
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

export const setVisibleDialogSolidLogin = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_SOLID_LOGIN',
        value: !!visible
    };
};

export const setVisibleDialogSolidLogout = (visible) => {
    return {
        type: 'SET_VISIBLE_DIALOG_SOLID_LOGOUT',
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
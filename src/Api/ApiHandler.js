import * as API from './Api.js';
import config from './../config.js';
import * as JSZip from 'jszip';


/**
 * Log a fetch response error and throw it again
 * @param {*} error 
 */
const logFetchError = async (error) => {
    let errorMessage = '';

    console.group('handleFetchError');
    if (error instanceof Response) {
        errorMessage = await error.text();

        console.error(`url: ${error.url}`);
        console.error(`status: ${error.status}`);
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
        console.error(error.stack);
    }
    else if (typeof error === 'string') {
        errorMessage = error;
    }
    else {
        errorMessage = JSON.stringify(error);
    }
    console.error(`errorMessage: ${errorMessage}`);
    console.error(`error: ${error}`);
    console.groupEnd();

    throw new Error(errorMessage);
}

/**
 * Clean path string removing double slashes and prepending a slash
 * @param {String} path
 * @returns {String}
 */
const fixPath = (path) => {
    return ('/' + path).replace(/\/\//g, '/');
};

/**
 * Wrap API response for retrieving item list
 * @param {String} path
 * @returns {Promise<API.FolderItems>}
 */
export const getItemList = (path) => {
    path = fixPath(path);
    return API.readFolder(path)
        .then(({ files, folders }) => [...files, ...folders])
        .catch(logFetchError);
};

/**
 * Wrap API response for retrieving file content
 * @param {String} path
 * @param {String} filename
 * @returns {Promise<Blob>}
 */
export const getFileBlob = (path, filename) => {
    path = fixPath(path);
    return API.fetchFile(path, filename)
        .then(response => response.blob())
        .catch(logFetchError);
};


/**
 * Wrap API response for renaming a file
 * @param {String} path
 * @param {String} fileName
 * @param {String} newFileName
 * @returns {Promise<Response>}
 */
export const renameFile = (path, fileName, newFileName) => {
    path = fixPath(path);
    return API.renameFile(path, fileName, newFileName)
        .catch(logFetchError)
};


/**
 * Wrap API response for renaming a folder
 * @param {String} path
 * @param {String} folderName
 * @param {String} newFolderName
 * @returns {Promise<Response>}
 */
export const renameFolder = (path, folderName, newFolderName) => {
    path = fixPath(path);
    return API.renameFolder(path, folderName, newFolderName)
        .catch(logFetchError)
};

/**
 * Wrap API response for creating a folder
 * @param {String} path
 * @param {String} folder
 * @returns {Promise<Response>}
 */
export const createFolder = (path, folder) => {
    path = fixPath(path);
    if (!(folder || '').trim()) {
        return Promise.reject('Invalid folder name');
    }
    return API.createFolder(path, folder)
        .catch(logFetchError)
};

/**
 * Wrap API response for removing a file or folder
 * @param {String} path
 * @param {Array<String>} filenames
 * @returns {Promise<Response>}
 */
export const removeItems = (path, filenames) => {
    path = fixPath(path);
    if (!filenames.length) {
        return Promise.reject('No files to remove');
    }
    return API.removeItems(path, filenames)
        .catch(logFetchError)
};

/**
 * Wrap API response for moving a file or folder
 * @param {String} path
 * @param {String} destination
 * @param {Array<String>} filenames
 * @returns {Promise<Response>}
 */
export const moveItems = (path, destination, filenames) => {
    path = fixPath(path);
    destination = fixPath(destination);
    if (!filenames.length) {
        return Promise.reject('No files to move');
    }
    return API.moveItems(path, destination, filenames)
        .catch(logFetchError)
};

/**
 * Wrap API response for copying a file or folder
 * @param {String} path
 * @param {String} destination
 * @param {Array<String>} filenames
 * @returns {Promise<Response>}
 */
export const copyItems = (path, destination, filenames) => {
    path = fixPath(path);
    destination = fixPath(destination);
    if (!filenames.length) {
        return Promise.reject('No files to copy');
    }
    return API.copyItems(path, destination, filenames)
        .catch(logFetchError)
};

/**
 * Wrap API response for uploading files
 * @param {String} path
 * @param {Object<FileList>} fileList
 * @returns {Promise<Response>}
 */
export const uploadFiles = (path, fileList) => {
    path = fixPath(path);

    if (!fileList.length) {
        return Promise.reject('No files to upload');
    }
    return API.upload(path, fileList)
        .catch(logFetchError)
};

/**
 * Wrap API response for uploading a file
 * @param {String} path
 * @param {String} fileName
 * @param {Blob} content
 * @returns {Promise<Response>}
 */
export const updateFile = (path, fileName, content) => {
    path = fixPath(path);
    return API.updateItem(path, fileName, content)
        .catch(logFetchError);
};

/**
 * Wrap API response for zipping multiple items
 * @param {String} path
 * @param {Array<API.FolderItems>} itemList
 * @returns {Promise<Object>}
 */
export const getAsZip = (path, itemList) => {
    path = fixPath(path);
    const zip = new JSZip();

    return addItemsToZip(zip, path, itemList)
        .then(() => zip);
}

/**
 * Add items to a zip object recursively
 * @param {Object} zip
 * @param {String} path
 * @param {Array<API.FolderItems>} itemList
 * @returns {Promise<Object>}
 */
const addItemsToZip = (zip, path, itemList) => {
    const promises = itemList.map(async item => {
        if (item.type === 'dir') {
            const zipFolder = zip.folder(item.name);
            const folderPath = `${path}/${item.name}`;
            const folderItems = await getItemList(folderPath);
            return addItemsToZip(zipFolder, folderPath, folderItems);
        }
        else if (item.type === 'file') {
            const blob = await getFileBlob(path, item.name);
            return zip.file(item.name, blob, { binary: true });
        }
    });

    return Promise.all(promises);
}

/**
 * Wrap API response for extracting a zip archive
 * @param {String} path
 * @param {String} destination
 * @param {String} fileName
 */
export const extractZipArchive = async (path, destination = path, fileName) => {
    const blob = await getFileBlob(path, fileName);
    const zip = await JSZip.loadAsync(blob);

    return uploadExtractedZipArchive(zip, destination);
};

/**
 * Recursively upload all files and folders from an extracted zip archive
 * @param {Object} zip 
 * @param {String} destination 
 * @param {String} curFolder 
 */
async function uploadExtractedZipArchive(zip, destination, curFolder = '') {
    const promises = getItemsInZipFolder(zip, curFolder)
        .map(async item => {
            const relativePath = item.name;
            const itemName = getItemNameFromPath(relativePath);
            const path = getParentPathFromPath(`${destination}/${relativePath}`);

            if (item.dir) {
                await createFolder(path, itemName);
                return uploadExtractedZipArchive(zip, destination, relativePath);
            }
            else {
                const blob = await item.async('blob');
                return updateFile(path, itemName, blob);
            }
        });

    return Promise.all(promises);
};

function getItemsInZipFolder(zip, folderPath) {
    return Object.keys(zip.files)
        .filter(fileName => {
            // Only items in the current folder and subfolders
            const relativePath = fileName.slice(folderPath.length, fileName.length);
            if (!relativePath || fileName.slice(0, folderPath.length) !== folderPath)
                return false;
            
            // No items from subfolders
            if (relativePath.includes('/') && relativePath.slice(0, -1).includes('/'))
                return false;
            
            console.log(`found in folder: ${fileName}`);
            return true;
        })
        .map(key => zip.files[key]);
};


/**
 * Calculate available actions for a file
 * @param {Object} file
 * @returns {Array<String>}
 */
export const getActionsByFile = (file, acts = []) => {
    if (file.type === 'dir') {
        acts.push('open');

        typeof file.compressible !== 'undefined' ?
            file.compressible && acts.push('compress') :
            acts.push('compress');
    }

    if (file.type === 'file') {
        config.isImageFilePattern.test(file.name) && acts.push('open');

        typeof file.editable !== 'undefined' ?
            file.editable && acts.push('edit') :
            config.isEditableFilePattern.test(file.name) && acts.push('edit');

        typeof file.extractable !== 'undefined' ?
            file.extractable && acts.push('extract') :
            config.isExtractableFilePattern.test(file.name) && acts.push('extract');
    }

    acts.push('openInNewTab');
    acts.push('download');
    acts.push('copy');
    acts.push('move');
    acts.push('rename');
    acts.push('perms');
    acts.push('remove');

    return acts;
}

/**
 * Calculate available actions for selected files, only leaving common actions
 * @param {Array<Object>} files
 * @returns {Array<String>}
 */
export const getActionsByMultipleFiles = (files, acts = []) => {
    files.forEach(file => {
        const fileActs = getActionsByFile(file);
        // intersects previous actions with the following to leave only common actions
        acts = acts.length ?
            acts.filter(value => -1 !== fileActs.indexOf(value)) 
            : fileActs;
    });

    if (files.length > 1) {
        const removeAction = name => acts.splice(acts.indexOf(name), acts.indexOf(name) > -1);
        const addAction = name => acts.includes(name) || acts.push(name);
        removeAction('open');
        removeAction('openInNewTab');
        removeAction('edit');
        removeAction('rename');

        addAction('compress');
    }
    return acts;
}

/**
 * Calculate file size by bytes in human readable format
 * @param {Number} bytes
 * @returns {String}
 */
export const getHumanFileSize = (bytes) => {
    const e = (Math.log(bytes) / Math.log(1e3)) | 0;
    return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
};


function getItemNameFromPath(path) {
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return path.substr(path.lastIndexOf('/') + 1);
}

function getParentPathFromPath(path) {
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    path = path.substr(0, path.lastIndexOf('/'));
    return path;
}
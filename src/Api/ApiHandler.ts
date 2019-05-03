import * as API from './Api';
import JSZip from 'jszip';
import { FileItem, FolderItem, Item } from './Item';
import ApiCache from './ApiCache';

const cache = new ApiCache();

/**
 * Log a fetch response error and throw it again
 * @param {*} error 
 */
const handleFetchError = async (error: Error | Response | string) => {
    let detailedErrorMessage = '';
    let displayErrorMessage: string | undefined;

    console.group('handleFetchError');
    if (error instanceof Response) {
        detailedErrorMessage = await error.text();

        console.error(`url: ${error.url}`);
        console.error(`status: ${error.status}`);

        const displayMessages: Record<string, string> = {
            '401': `The ressource at ${error.url} requires you to login.`,
            '403': `You don't have permission to access the ressource at ${error.url}.
            Please make sure that you are logged in with the correct account.
            If the server runs with version 5.0.0 or higher, make sure you gave this app read/write permission`,
            '404': `The ressource at ${error.url} was not found`,
            '500': `An internal server error occured...
            ${detailedErrorMessage}`,
        };
        if (error.status in displayMessages)
            displayErrorMessage = displayMessages[error.status];
    }
    else if (error instanceof Error) {
        detailedErrorMessage = error.message;
        console.error(error.stack);
    }
    else if (typeof error === 'string') {
        detailedErrorMessage = error;
    }
    else {
        detailedErrorMessage = JSON.stringify(error);
    }
    console.error(`errorMessage: ${detailedErrorMessage}`);
    console.error(`error: ${error}`);
    console.groupEnd();

    throw new Error((displayErrorMessage) ? displayErrorMessage : detailedErrorMessage);
}

/**
 * Clean path string removing double slashes and prepending a slash if non-empty
 */
const fixPath = (path: string): string => {
    if (path === "")
        return path;
    return ('/' + path).replace(/\/\//g, '/');
};

/**
 * Wrap API response for retrieving item list
 * itemList is cached automatically
 * @param {String} path
 * @returns {Promise<API.FolderItems>}
 */
export const getItemList = (path: string): Promise<Item[]> => {
    path = fixPath(path);
    if (cache.contains(path))
        return Promise.resolve(cache.get(path));
    return API.readFolder(path)
        .then(({ files, folders }) => [...files, ...folders])
        .then(itemList => cache.add(path, itemList))
        .catch(handleFetchError);
};

export const clearCacheForFolder = (path: string) => cache.remove(fixPath(path));
export const clearCache = () => cache.clear();

/**
 * Wrap API response for retrieving file content
 */
export const getFileBlob = (path: string, filename: string): Promise<Blob> => {
    path = fixPath(path);
    return API.fetchFile(path, filename)
        .then(response => response.blob())
        .catch(handleFetchError);
};


/**
 * Wrap API response for renaming a file
 */
export const renameFile = (path: string, fileName: string, newFileName: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return API.renameFile(path, fileName, newFileName)
        .catch(handleFetchError)
};


/**
 * Wrap API response for renaming a folder
 */
export const renameFolder = (path: string, folderName: string, newFolderName: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return API.renameFolder(path, folderName, newFolderName)
        .catch(handleFetchError)
};

/**
 * Wrap API response for creating a folder
 */
export const createFolder = (path: string, folderName: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    if (!(folderName || '').trim()) {
        return Promise.reject('Invalid folder name');
    }
    return API.createFolder(path, folderName)
        .catch(handleFetchError)
};

/**
 * Wrap API response for removing a file or folder
 */
export const removeItems = (path: string, filenames: string[]): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    if (!filenames.length) {
        return Promise.reject('No files to remove');
    }
    return API.removeItems(path, filenames)
        .catch(handleFetchError)
};

/**
 * Wrap API response for moving a file or folder
 */
export const moveItems = (path: string, destination: string, filenames: string[]): Promise<Response> => {
    path = fixPath(path);
    destination = fixPath(destination);
    cache.remove(path, destination);
    if (!filenames.length) {
        return Promise.reject('No files to move');
    }
    return API.moveItems(path, destination, filenames)
        .catch(handleFetchError)
};

/**
 * Wrap API response for copying a file or folder
 */
export const copyItems = (path: string, destination: string, filenames: string[]): Promise<Response> => {
    path = fixPath(path);
    destination = fixPath(destination);
    cache.remove(path, destination);
    if (!filenames.length) {
        return Promise.reject('No files to copy');
    }
    return API.copyItems(path, destination, filenames)
        .catch(handleFetchError)
};

/**
 * Wrap API response for uploading files
 */
export const uploadFiles = (path: string, fileList: FileList): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);

    if (!fileList.length) {
        return Promise.reject('No files to upload');
    }
    return API.upload(path, fileList)
        .catch(handleFetchError)
};

/**
 * Wrap API response for uploading a file
 */
export const updateFile = (path: string, fileName: string, content: Blob|string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return API.updateFile(path, fileName, content)
        .catch(handleFetchError);
};

/**
 * Wrap API response for zipping multiple items
 */
export const getAsZip = (path: string, itemList: Item[]): Promise<JSZip> => {
    path = fixPath(path);
    const zip = new JSZip();

    return addItemsToZip(zip, path, itemList)
        .then(() => zip);
}

/**
 * Add items to a zip object recursively
 */
const addItemsToZip = (zip: JSZip, path: string, itemList: Item[]): Promise<void[]> => {
    const promises = itemList.map(async item => {
        if (item instanceof FolderItem) {
            const zipFolder = zip.folder(item.name);
            const folderPath = `${path}/${item.name}`;
            const folderItems = await getItemList(folderPath);
            await addItemsToZip(zipFolder, folderPath, folderItems);
        }
        else if (item instanceof FileItem) {
            const blob = await getFileBlob(path, item.name);
            zip.file(item.name, blob, { binary: true });
        }
    });

    return Promise.all(promises);
}

/**
 * Wrap API response for extracting a zip archive
 */
export const extractZipArchive = async (path: string, destination: string = path, fileName: string) => {
    const blob = await getFileBlob(path, fileName);
    const zip = await JSZip.loadAsync(blob);

    return uploadExtractedZipArchive(zip, destination);
};

/**
 * Recursively upload all files and folders from an extracted zip archive
 */
async function uploadExtractedZipArchive(zip: JSZip, destination: string, curFolder = ''): Promise<void[]> {
    const promises = getItemsInZipFolder(zip, curFolder)
        .map(async item => {
            const relativePath = item.name;
            const itemName = getItemNameFromPath(relativePath);
            const path = getParentPathFromPath(`${destination}/${relativePath}`);

            if (item.dir) {
                await createFolder(path, itemName);
                await uploadExtractedZipArchive(zip, destination, relativePath);
            }
            else {
                const blob = await item.async('blob');
                await updateFile(path, itemName, blob);
            }
        });

    return Promise.all(promises);
};

function getItemsInZipFolder(zip: JSZip, folderPath: string): JSZip.JSZipObject[] {
    return Object.keys(zip.files)
        .filter(fileName => {
            // Only items in the current folder and subfolders
            const relativePath = fileName.slice(folderPath.length, fileName.length);
            if (!relativePath || fileName.slice(0, folderPath.length) !== folderPath)
                return false;
            
            // No items from subfolders
            if (relativePath.includes('/') && relativePath.slice(0, -1).includes('/'))
                return false;

            return true;
        })
        .map(key => zip.files[key]);
};

function getItemNameFromPath(path: string): string {
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return path.substr(path.lastIndexOf('/') + 1);
}

function getParentPathFromPath(path: string): string {
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    path = path.substr(0, path.lastIndexOf('/'));
    return path;
}

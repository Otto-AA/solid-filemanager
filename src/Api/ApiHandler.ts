import JSZip from 'jszip';
import { FileItem, FolderItem, Item } from './Item';
import ApiCache from './ApiCache';
import config from './../config';
import SolidFileClient from 'solid-file-client';
import { guessContentType } from './contentTypes';
import { fetch } from '@inrupt/solid-client-authn-browser';

const fileClient = new SolidFileClient({ fetch }, { enableLogging: true });
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
 * @returns {Promise<Item[]>}
 */
export const getItemList = async (path: string): Promise<Item[]> => {
    path = fixPath(path);
    if (cache.contains(path))
        return cache.get(path);

    try {
        const url = buildFolderUrl(path);
        const folderData = await fileClient.readFolder(url, { links: SolidFileClient.LINKS.EXCLUDE })
        const itemList = [
            ...folderData.files.map(item => new FileItem(item.url)), // TODO: item.size
            ...folderData.folders.map(item => new FolderItem(item.url)) // TODO: item.size
        ]
        cache.add(path, itemList);
        return itemList
    } catch (err) {
        throw handleFetchError(err);
    }
};

export const clearCacheForFolder = (path: string) => cache.remove(fixPath(path));
export const clearCache = () => cache.clear();

/**
 * Wrap API response for retrieving file content
 */
export const getFileBlob = async (path: string, filename: string): Promise<Blob> => {
    path = fixPath(path);
    try {
        const res = await fileClient.get(buildFileUrl(path, filename));
        return res.blob();
    } catch (err) {
        throw handleFetchError(err);
    }
};


/**
 * Wrap API response for renaming a file
 */
export const renameFile = (path: string, fileName: string, newFileName: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return fileClient.rename(buildFileUrl(path, fileName), newFileName)
        .then(res => Array.isArray(res) ? res[0] : res)
        .catch(handleFetchError)
};


/**
 * Wrap API response for renaming a folder
 */
export const renameFolder = (path: string, folderName: string, newFolderName: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return fileClient.rename(buildFolderUrl(path, folderName), newFolderName)
        .then(res => Array.isArray(res) ? res[0] : res)
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
    return fileClient.createFolder(buildFolderUrl(path, folderName), {
        merge: SolidFileClient.MERGE.KEEP_TARGET
    })
        .catch(handleFetchError)
};

/**
 * Fetch API to remove one item
 */
export async function removeItem(path: string, itemName: string): Promise<Response> { // TODO: use fileClient
    const url = buildFileUrl(path, itemName);

    return fileClient.delete(url)
        .catch(err => {
            if (err.status === 409 || err.status === 301) {
                // Solid pod returns 409 if the item is a folder and is not empty
                // Solid pod returns 301 if is attempted to read a folder url without '/' at the end (from buildFileUrl)
                return fileClient.deleteFolderRecursively(buildFolderUrl(path, itemName));
            }
            else if (err.status === 404) {
                // Don't throw if the item didn't exist
                return err;
            }
            else
                throw err
        })
}

/**
 * Wrap API response for removing a file or folder
 */
export const removeItems = (path: string, filenames: string[]): Promise<Response[]> => {
    path = fixPath(path);
    cache.remove(path);
    if (!filenames.length) {
        return Promise.reject('No files to remove');
    }
    return Promise.all(filenames.map(name => removeItem(path, name)))
        .catch(handleFetchError);
};

/**
 * Wrap API response for moving a file or folder
 */
export const moveItems = (path: string, destination: string, filenames: string[]): Promise<Response[]> => {
    path = fixPath(path);
    destination = fixPath(destination);
    cache.remove(path, destination);
    if (!filenames.length) {
        return Promise.reject('No files to move');
    }

    return copyItems(path, destination, filenames)
        .then(res => removeItems(path, filenames))
        .catch(handleFetchError)
};

/**
 * Wrap API response for copying a file or folder
 */
export const copyItems = async (path: string, destination: string, filenames: string[]): Promise<Response[]> => {
    path = fixPath(path);
    destination = fixPath(destination);
    cache.remove(path, destination);
    if (!filenames.length) {
        return Promise.reject('No files to copy');
    }

    const items = await getItemList(path)
        .then(items => items.filter(({ name }) => filenames.includes(name)))
    const promises: Promise<(Response | Response[])>[] = []
    for (const item of items) {
        if (item instanceof FolderItem) {
            promises.push(fileClient.copyFolder(buildFolderUrl(path, item.name), buildFolderUrl(destination, item.name), {
                withAcl: false,
                withMeta: true,
                createPath: true,
                merge: SolidFileClient.MERGE.KEEP_SOURCE
            }))
        } else {
            promises.push(fileClient.copyFile(buildFileUrl(path, item.name), buildFileUrl(destination, item.name), {
                withAcl: false,
                withMeta: true,
                createPath: true,
                merge: SolidFileClient.MERGE.REPLACE
            }))
        }
    }
    
    return Promise.all(promises)
        .then(responses => responses.flat(1))
        .catch(handleFetchError);
};

/**
 * Wrap API response for uploading files
 */
export const uploadFiles = async (path: string, fileList: FileList): Promise<Response[]> => {
    path = fixPath(path);
    cache.remove(path);

    if (!fileList.length) {
        return Promise.reject('No files to upload');
    }
    const promises = Array.from(fileList).map(async file => {
      const contentType = file.type || (await guessContentType(file.name, file))
      return updateFile(path, file.name, file, contentType)
    });
    return Promise.all(promises).catch(handleFetchError);
};

/**
 * Wrap API response for uploading a file
 */
export const updateFile = (path: string, fileName: string, content: Blob|string, contentType: string): Promise<Response> => {
    path = fixPath(path);
    cache.remove(path);
    return fileClient.putFile(buildFileUrl(path, fileName), content, contentType)
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
            const zipFolder = zip.folder(item.name) as JSZip;
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
                const contentType = blob.type ? blob.type : await guessContentType(item.name, blob);
                await updateFile(path, itemName, blob, contentType);
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

/**
 * Build up an url from a path relative to the storage location and a folder name
 */
function buildFolderUrl(path: string, folderName?: string): string {
    return buildFileUrl(path, folderName) + '/';
}


/**
 * Build up an url from a path relative to the storage location and a fileName
 */
function buildFileUrl(path: string, fileName?: string): string {
    let url = `${config.getHost()}${path}/${fileName || ''}`;
    while (url.slice(-1) === '/')
        url = url.slice(0, -1);

    return url;
}

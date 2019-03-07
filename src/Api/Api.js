import config from './../config.js';
import * as folderUtils from './folderUtils.js';
import * as solidAuth from 'solid-auth-client';

/**
 * @typedef {Object} FolderItems
 * @property {Array<{Object}>} files
 * @property {Array<{Object}>} folders
 */


/**
 * Fetch API to get item
 * @param {String} path
 * @param {String} itemName
 * @returns {Response}
 */
export async function fetchItem(path, itemName = '') {
    const url = buildUrl(path, itemName);
    return solidAuth.fetch(url)
        .then(assertSuccessfulResponse);
};


/**
 * Fetch API to retrieve object containing a files and folders array
 * @param {String} path
 * @param {String} folderName
 * @returns {Promise<FolderItems>}
 */
export async function readFolder(path, folderName = '') {
    const url = buildUrl(path, folderName);

    const response = await fetchItem(path, folderName);
    const folderRDF = await response.text();
    const graph = await folderUtils.text2graph(folderRDF, url, 'text/turtle');
    const folderItems = folderUtils.getFolderItems(graph, url);

    return folderItems;
}


/**
 * Fetch API to move items
 * @param {String} path
 * @param {String} destination
 * @param {Array<String>} itemNames
 * @returns {Response}
 */
export async function moveItems(path, destination, itemNames) {
    await copyItems(path, destination, itemNames);
    return removeItems(path, itemNames);
};


/**
 * Fetch API to rename a file
 * @param {String} path
 * @param {String} oldName
 * @param {String} newName
 * @returns {Response}
 */
export async function renameFile(path, oldName, newName) {
    await copyFile(path, oldName, path, newName);
    return removeItem(path, oldName);
};


/**
 * Fetch API to rename a folder
 * @param {String} path
 * @param {String} oldFolderName
 * @param {String} newFolderName
 * @returns {Response}
 */
export async function renameFolder(path, oldFolderName, newFolderName) {
    await copyFolder(path, oldFolderName, path, newFolderName);
    return removeFolderRecursively(path, oldFolderName);
};


/**
 * Fetch API to copy files
 * @param {String} path
 * @param {String} destination
 * @param {Array} itemNames
 * @returns {Response}
 */
export async function copyItems(path, destination, itemNames) {
    let { files, folders } = await readFolder(path);

    files = files.filter(({ name }) => itemNames.includes(name));
    folders = folders.filter(({ name }) => itemNames.includes(name));

    const promises = [
        ...files.map(({ name }) => copyFile(path, name, destination, name)),
        ...folders.map(({ name }) => copyFolder(path, name, destination, name))
    ];

    await Promise.all(promises);
    return new Response();
};


/**
 * Fetch API to copy a file
 * @param {String} originPath
 * @param {String} originName
 * @param {String} destinationPath
 * @param {String} destinationName
 * @returns {Response}
 */
export async function copyFile(originPath, originName, destinationPath, destinationName) {
    const destinationUrl = buildUrl(destinationPath, destinationName);

    const itemResponse = await fetchItem(originPath, originName);
    const content = (itemResponse.headers.get('Content-Type') === 'application/json') ?
        await itemResponse.text()
        : await itemResponse.blob();

    return solidAuth.fetch(destinationUrl, {
        method: 'PUT',
        body: content
    }).then(assertSuccessfulResponse);
}


/**
 * Fetch API to copy a folder recursively
 * @param {String} originPath 
 * @param {String} originName 
 * @param {String} destinationPath 
 * @param {String} destinationName 
 * @return {Response}
 */
export async function copyFolder(originPath, originName, destinationPath, destinationName) {
    // TODO: Combine these two promises for better performance
    await createFolder(destinationPath, destinationName);
    const { files, folders } = await readFolder(originPath, originName);

    const promises = [
        ...files.map(({ name }) => copyFile(`${originPath}/${originName}`, name, `${destinationPath}/${destinationName}`, name)),
        ...folders.map(({ name }) => copyFolder(`${originPath}/${originName}`, name, `${destinationPath}/${destinationName}`, name))
    ];

    await Promise.all(promises);
    return new Response();
}


/**
 * Fetch API to upload files
 * @param {String} path
 * @param {FileList} fileList
 * @returns {Response}
 */
export async function upload(path, fileList) {
    const promises = Array.from(fileList).map(file => updateItem(path, file.name, file));
    await Promise.all(promises);
    return new Response();
};


/**
 * Fetch API to create a folder
 * @param {String} path
 * @param {String} folderName
 * @returns {Response}
 */
export async function createFolder(path, folderName) {
    if (await itemExists(path, folderName))
        return new Response();

    return createItem(path, folderName, '', 'dir');
}


/**
 * Fetch API to create update or create an item
 * @param {String} path
 * @param {String} itemName
 * @param {String} content
 * @param {String} contentType
 * @returns {Response}
 */
export async function updateItem(path, itemName, content, contentType) {
    await removeItem(path, itemName);
    return createItem(path, itemName, content, contentType);
}


/**
 * Fetch API to create create an item
 * @param {String} path
 * @param {String} itemName
 * @param {String} content
 * @param {String} contentType
 * @returns {Response}
 */
async function createItem(path, itemName, content, contentType) {
    const baseUrl = `${config.getHost()}${path}`;
    const link = (contentType === 'dir') ?
        '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
        : '<http://www.w3.org/ns/ldp#Resource>; rel="type"';

    const request = {
        method: 'POST',
        headers: {
            link,
            slug: itemName,
            'Content-Type': contentType
        },
        body: content
    };

    return solidAuth.fetch(baseUrl, request)
        .then(assertSuccessfulResponse);
}


/**
 * Fetch API to remove multiple items
 * @param {String} path
 * @param {Array} itemNames
 * @returns {Response}
 */
export async function removeItems(path, itemNames) {
    await Promise.all(itemNames.map(itemName => removeItem(path, itemName)));
    return new Response();
};


/**
 * Fetch API to remove one item
 * @param {String} path 
 * @param {String} itemName 
 * @returns {Response}
 */
export async function removeItem(path, itemName) {
    const url = buildUrl(path, itemName);

    const response = await solidAuth.fetch(url, { method: 'DELETE' });
    if (response.status === 409) {
        // Solid pod returns 409 if the item is a folder and is not empty
        return removeFolderRecursively(path, itemName);
    }
    else if (response.status === 404) {
        // Don't throw if the item didn't exist
        return response;
    }
    else {
        assertSuccessfulResponse(response);
        return response;
    }
}


/**
 * Fetch API to remove contents and folder itself recursively
 * @param {String} path 
 * @param {String} folderName
 * @returns {Response}
 */
export async function removeFolderRecursively(path, folderName) {
    await removeFolderContents(path, folderName);
    return removeItem(path, folderName);
}


/**
 * Fetch API to remove contents of one folder recursively
 * @param {String} path 
 * @param {String} folderName
 * @returns {Response}
 */
export async function removeFolderContents(path, folderName) {
    const folderPath = `${path}/${folderName}`;

    const { files, folders } = await readFolder(path, folderName);
    const promises = [
        ...files.map(({ name }) => removeItem(folderPath, name)),
        ...folders.map(({ name }) => removeFolderRecursively(folderPath, name))
    ];
    await Promise.all(promises);
    return new Response();
}


/**
 * Fetch API to create update or create an item
 * @param {String} path
 * @param {String} itemName
 * @returns {Promise<Boolean>}
 */
export async function itemExists(path, itemName) {
    try {
        await fetchItem(path, itemName);
        return true;
    }
    catch (error) {
        if (error instanceof Response && error.status === 404)
            return false;

        throw error;
    }
}


/**
 * Build up an url from a path relative to the storage location and an itemName
 * @param {String} path 
 * @param {Sting} itemName 
 * @return {String}
 */
function buildUrl(path, itemName = '') {
    let url = `${config.getHost()}${path}/${itemName}`;
    while (url.slice(-1) === '/')
        url = url.slice(0, -1);

    return url;
}


/**
 * Throw response if fetch response was unsuccessful
 * @param {Response} response
 * @returns {Response}
 */
const assertSuccessfulResponse = (response) => {
    if (!response.ok)
        throw response;
    return response;
};
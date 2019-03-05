import config from './../config.js';
import * as solidAuth from 'solid-auth-client';
import * as fileClient from 'solid-file-client';

/**
 * Fetch API to list files from directory
 * @param {String} path
 * @returns {Object}
 */
export function list(path) {
    const url = config.getHost() + path;
    return solidAuth.fetch(url);
};

/**
 * Fetch API to create a directory
 * @param {String} path
 * @param {String} directory
 * @returns {Object}
 */
export function createDirectory(path, directory) {
    const url = `${config.getHost()}${path}/${directory}`;
    return fileClient.createFolder(url)
        .then(() => new Response());
};


/**
 * Fetch API to get file body
 * @param {String} path
 * @returns {Object}
 */
export function getFileContent(path) {
    const url = config.getHost() + path;
    return solidAuth.fetch(url);
};


/**
 * Fetch API to remove a file or folder
 * @param {String} path
 * @param {Array} itemNames
 * @returns {Object}
 */
export function remove(path, itemNames) {
    return Promise.all(itemNames.map(itemName => removeItem(path, itemName)))
        .then(() => new Response());
};


function removeItem(path, itemName) {
    const url = `${config.getHost()}${path}/${itemName}`;

    return fileClient.deleteFile(url)
        .then(response => {
            if (response === 'OK') {
                return new Response();
            }
            if (response.includes('409 (Conflict)')) {
                return removeFolder(path, itemName);
            }
            throw response;
        });
}

async function removeFolder(path, folderName) {
    const folderPath = `${path}/${folderName}`;
    const url = `${config.getHost()}${folderPath}`;

    const { files, folders } = await fileClient.readFolder(url);
    const promises = [
        ...files.map(({ name }) => removeItem(folderPath, name)),
        ...folders.map(({ name }) => removeFolder(folderPath, name))
    ];
    await Promise.all(promises);
    await fileClient.deleteFolder(url);

    return new Response();
}

/**
 * Fetch API to move files
 * @param {String} path
 * @param {String} destination
 * @param {Array} filenames
 * @returns {Object}
 */
export function move(path, destination, filenames) {
    return copy(path, destination, filenames)
        .then(() => remove(path, filenames));
};

/**
 * Fetch API to rename a file
 * @param {String} path
 * @param {String} from
 * @param {String} to
 * @returns {Object}
 */
export function renameFile(path, from, to) {
    return copyFile(path, from, path, to)
        .then(() => removeItem(path, from))
        .then(() => new Response());
};


/**
 * Fetch API to rename files
 * @param {String} path
 * @param {Array} filenames
 * @returns {Object}
 */
export function renameFolder(path, folderName, newFolderName) {
    return copyFolder(path, folderName, path, newFolderName)
        .then(() => removeFolder(path, folderName))
        .then(() => new Response());
};

/**
 * Fetch API to copy files
 * @param {String} path
 * @param {Array} itemNames
 * @param {Boolean} recursive
 * @returns {Object}
 */
export async function copy(path, destination, itemNames) {
    const originFolderUrl = config.getHost() + path;

    let { files, folders } = await fileClient.readFolder(originFolderUrl);

    files = files.filter(({ name }) => itemNames.includes(name));
    folders = folders.filter(({ name }) => itemNames.includes(name));

    const promises = [
        ...files.map(({ name }) => copyFile(path, name, destination, name)),
        ...folders.map(({ name }) => copyFolder(path, name, destination, name))
    ];

    await Promise.all(promises);
    return new Response();
};


async function copyFile(originPath, originName, destinationPath, destinationName) {
    const from = `${config.getHost()}${originPath}/${originName}`;
    const to = `${config.getHost()}${destinationPath}/${destinationName}`;

    const fileResponse = await solidAuth.fetch(from);
    const content = (fileResponse.headers.get('Content-Type') === 'application/json') ?
        await fileResponse.text()
        : await fileResponse.blob();

    return solidAuth.fetch(to, {
        method: 'PUT',
        body: content
    });
}

async function copyFolder(originPath, originName, destinationPath, destinationName) {
    const from = `${config.getHost()}${originPath}/${originName}`;

    // TODO: Combine these two promises for better performance
    await createDirectory(destinationPath, destinationName);
    const { files, folders } = await fileClient.readFolder(from);

    const promises = [
        ...files.map(({ name }) => copyFile(`${originPath}/${originName}`, name, `${destinationPath}/${destinationName}`, name)),
        ...folders.map(({ name }) => copyFolder(`${originPath}/${originName}`, name, `${destinationPath}/${destinationName}`, name))
    ];

    await Promise.all(promises);
}

/**
 * Fetch API to upload files
 * @param {String} path
 * @param {Object<FileList>} fileList
 * @returns {Object}
 */
export function upload(path, fileList) {
    const baseUrl = config.getHost() + path;

    const promises = Array.from(fileList).map(file => fileClient.updateFile(`${baseUrl}/${file.name}`, file));
    return Promise.all(promises)
        .then(() => new Response());
};

/**
 * Fetch API to upload a text
 * @param {String} path
 * @param {String} fileName
 * @param {String} content
 * @returns {Object} 
*/
export function updateTextFile(path, fileName, content) {
    const url = `${config.getHost()}${path}/${fileName}`;
    return fileClient.updateFile(url, content)
        .then(() => new Response());
}
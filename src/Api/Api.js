import config from './../config.js';
import * as solidAuth from 'solid-auth-client';
import * as fileClient from 'solid-file-client';

/**
 * Fetch API to list files from directory
 * @param {String} path
 * @returns {Object}
 */
export function list(path) {
    const url = config.host + path;
    return solidAuth.fetch(url);
};

/**
 * Fetch API to create a directory
 * @param {String} path
 * @param {String} directory
 * @returns {Object}
 */
export function createDirectory(path, directory) {
    const url = `${config.host}${path}/${directory}`;
    return fileClient.createFolder(url)
        .then(() => new Response());
};


/**
 * Fetch API to get file body
 * @param {String} path
 * @returns {Object}
 */
export function getFileContent(path) {
    const url = config.host + path;
    return solidAuth.fetch(url);
};


/**
 * Fetch API to remove a file or folder
 * @param {String} path
 * @param {Array} filenames
 * @returns {Object}
 */
export function remove(path, filenames) {
    const baseUrl = config.host + path;
    const promises = filenames.map(filename => fileClient.deleteFile(`${baseUrl}/${filename}`));
    return Promise.all(promises)
        .then(() => new Response());
};

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
 * Fetch API to rename files
 * @param {String} path
 * @param {Array} filenames
 * @returns {Object}
 */
export function renameFile(path, filename, newFileName) {
    const from = `${config.host}${path}/${filename}`;
    const to = `${config.host}${path}/${newFileName}`;

    return fileClient.copyFile(from, to)
        .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
        .then(() => fileClient.deleteFile(from))
        .then(() => new Response());
};


/**
 * Fetch API to rename files
 * @param {String} path
 * @param {Array} filenames
 * @returns {Object}
 */
export function renameFolder(path, folderName, newFolderName) {
    const from = `${config.host}${path}/${folderName}`;
    const to = `${config.host}${path}/${newFolderName}`;

    return createDirectory(path, newFolderName)
        .then(() => fileClient.copyFolder(from, to))
        .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
        .then(() => fileClient.deleteFolder(from)) // TODO: Make recurisve folder deletion
        .then(() => new Response());
};

/**
 * Fetch API to copy files
 * @param {String} path
 * @param {Array} filenames
 * @param {Boolean} recursive
 * @returns {Object}
 */
export function copy(path, destination, filenames) {
    const baseUrl = config.host + path;
    const baseNewUrl = config.host + destination;

    const promises = filenames.map(filename => fileClient.copyFile(`${baseUrl}/${filename}`, `${baseNewUrl}/${filename}`));
    return Promise.all(promises)
        .then(() => new Response());
};

/**
 * Fetch API to copy files
 * @param {String} path
 * @param {Object<FileList>} fileList
 * @returns {Object}
 */
export function upload(path, fileList, formData = new FormData()) {
    const baseUrl = config.host + path;

    const promises = Array.from(fileList).map(file => fileClient.updateFile(`${baseUrl}/${file.name}`, file));
    return Promise.all(promises)
        .then(() => new Response());
};

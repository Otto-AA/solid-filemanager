// eslint-disable-next-line no-unused-vars
import { Item } from './Item';

export default class ApiCache {
    constructor() {
        this._data = {};
    }

    /**
     * Add data to the cache
     * @param {Array<String>} path 
     * @param {Array<Item>} itemList 
     * @returns {Array<Item>}
     */
    add(path, itemList) {
        this._data[path] = itemList;
        return itemList;
    }

    /**
     * Return true if the url is already cached
     * @param {Array<String>} path 
     * @returns {Boolean}
     */
    contains(path) {
        return this._data.hasOwnProperty(path);
    }

    /**
     * Get the cached data
     * @param {Array<String>} path 
     * @returns {Array<Item>}
     */
    get(path) {
        return this._data[path];
    }

    /**
     * @param {Array<String>} path
     */
    remove(...paths) {
        paths.filter(path => this.contains(path))
            .forEach(path => delete this._data[path]);
    }

    clear() {
        this._data = {};
    }
}

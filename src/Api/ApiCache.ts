// eslint-disable-next-line no-unused-vars
import { Item } from './Item';

export default class ApiCache {
    _data: Record<string, Item[]> = {};

    /**
     * Add data to the cache
     */
    add(path: string, itemList: Item[]): Item[] {
        this._data[path] = itemList;
        return itemList;
    }

    /**
     * Return true if the url is already cached
     */
    contains(path: string): boolean {
        return Object.keys(this._data).includes(path);
    }

    /**
     * Get the cached data
     */
    get(path: string): Item[] {
        return this._data[path];
    }

    /**
     * Remove paths from the cache
     */
    remove(...paths: string[]) {
        paths.filter(path => this.contains(path))
            .forEach(path => delete this._data[path]);
    }

    /**
     * Clear the whole cache
     */
    clear() {
        this._data = {};
    }
}

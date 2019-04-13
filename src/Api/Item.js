/**
 * Class for an arbitrary item from a solid pod
 */
export class Item {
    /**
     * @param {String} url
     * @param {Number} size
     */
    constructor(url, size) {
        if (new.target === Item)
            throw new Error("Class Item should not directly be used");

        const path = getPathFromUrl(url);

        this._name = path.pop();
        this._path = path;
        this._url = url;
        this._size = size;
    }

    // Make properties readonly
    get name() { return this._name; }
    get path() { return this._path; }
    get url() { return this._url; }
    get size() { return this._size; }

    equals(item) {
        return this.name === item.name
            && this.path.length === item.path.length
            && this.path.every((val, index) => val === item.path[index]);
    }

    getDisplayName() {
        return decodeURI(this.name);
    }

    getDisplaySize() {
        return getHumanFileSize(this.size);
    }
}

export class FileItem extends Item {
    isImage() {
        return patterns.image.test(this.name);
    }

    isMedia() {
        return patterns.media.test(this.name);
    }

    isEditable() {
        return patterns.editable.test(this.name);
    }

    isExtractable() {
        return patterns.extractable.test(this.name);
    }

    isVideo() {
        return patterns.video.test(this.name);
    }
}

export class FolderItem extends Item { }


// regex patterns for testing if a file is of a specific type
const patterns = {
    editable: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|cfm|cgi|aspx?|ini|pl|py|md|css|cs|jsx?|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst|ttl)$/i,
    image: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
    media: /\.(mp3|ogg|wav|mp4|webm)$/i,
    video: /\.(mp4|webm|ogg)$/i,
    extractable: /\.(zip)$/i
};

/**
 * Calculate file size by bytes in human readable format
 * @param {Number} bytes
 * @returns {String}
 */
export const getHumanFileSize = (bytes) => {
    const e = (Math.log(bytes) / Math.log(1e3)) | 0;
    return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
};


/**
 * @param {String} url
 * @returns {Array<String>} path - containing the path including the last element (e.g. [public, test, index.html])
 */
const getPathFromUrl = url => {
    url = new URL(url);
    return url.pathname.split('/').filter(val => val !== '');
}
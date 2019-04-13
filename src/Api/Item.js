/**
 * Class for an arbitrary item from a solid pod
 */
export class Item {
    /**
     * @param {String} name
     * @param {Array<String>} path
     * @param {Number} size
     */
    constructor(name, path, size) {
        if (new.target === Item)
            throw new Error("Class Item should not directly be used");

        this.name = name;
        this.path = path;
        this.size = size;
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

// regex patterns for testing if a file is of a specific type
const patterns = {
    editable: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|cfm|cgi|aspx?|ini|pl|py|md|css|cs|jsx?|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst|ttl)$/i,
    image: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
    media: /\.(mp3|ogg|wav|mp4|webm)$/i,
    video: /\.(mp4|webm|ogg)$/i,
    extractable: /\.(zip)$/i
};

export class FolderItem extends Item {}
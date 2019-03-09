let host = null;

export default {
    getHost() {
        return host;
    },
    setHost(newHost) {
        host = newHost;
        while (host.slice(-1) === '/')
            host = host.slice(0, -1);
    },

    isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|cfm|cgi|aspx?|ini|pl|py|md|css|cs|jsx?|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst|ttl)$/i,
    isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
    isExtractableFilePattern: /\.(zip)$/i,

    actions: {
        create_folder: true,
        move: true,
        copy: true,
        copy_folder: true,
        compress: true,
        extract: true,
        edit: true,
        remove: true,
        upload: true,
        upload_by_chunks: true,
        preview_images: true,
    }
};

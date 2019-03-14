// Based on https://github.com/jeff-zucker/solid-file-client/blob/master/src/folderUtils.js
import * as rdflib from 'rdflib';

const folderType = 'dir';
const fileType = 'file';

export function getStats(graph, subjectName) {
    const subjectNode = rdflib.sym(subjectName);
    const mod = rdflib.sym('http://purl.org/dc/terms/modified');
    const size = rdflib.sym('http://www.w3.org/ns/posix/stat#size');
    // const mtime = rdflib.sym('http://www.w3.org/ns/posix/stat#mtime');
    let modified = graph.any(subjectNode, mod, undefined);
    if (typeof (modified) === "undefined") return false;
    else modified = modified.value;
    return {
        modified: modified,
        size: graph.any(subjectNode, size, undefined).value,
        // mtime: graph.any(subjectNode, mtime, undefined).value,
    };
}

/** A type used internally to indicate we are handling a folder */
/**
 * @param {rdflib.IndexedFormula} graph a rdflib.graph() database instance
 * @param {string} url location of the folder
 * @returns {string} content mime-type of a file, If it's a folder, return 'folder', 'unknown' for not sure
 */
export function getFileType(graph, url) {
    const folderNode = rdflib.sym(url);
    const isAnInstanceOfClass = rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const types = graph.each(folderNode, isAnInstanceOfClass, undefined);
    for (const index in types) {
        const contentType = types[index].value;
        if (contentType.match('ldp#BasicContainer'))
            return folderType;
        else
            return fileType;
    }
    return 'unknown';
}
export function getFolderItems(graph, subj) {
    const files = [];
    const folders = [];
    graph.each(
        rdflib.sym(subj),
        rdflib.sym('http://www.w3.org/ns/ldp#contains'),
        undefined
    ).forEach(item => {
        let newItem = {}
        newItem.type = getFileType(graph, item.value)
        const stats = getStats(graph, item.value)
        newItem.modified = stats.modified
        newItem.size = stats.size
        // newItem.mtime = stats.mtime
        newItem.label = decodeURIComponent(item.value).replace(/.*\//, '')

        if (newItem.type === folderType) {
            item.value = item.value.replace(/[/]+/g, '/');
            item.value = item.value.replace(/https:/, 'https:/');
            const name = item.value.replace(/\/$/, '')
            newItem.name = name.replace(/.*\//, '')
            newItem.url = item.value

            folders.push(newItem);
        }
        else {
            newItem.url = item.value
            newItem.name = item.value.replace(/.*\//, '')

            files.push(newItem);
        }
    });

    return { files, folders };
}

/**
 * @param {string} text RDF text that can be passed to $rdf.parse()
 * @param {*} content the request body
 * @param {string} contentType Content-Type of the request
 * @returns {$rdf.IndexedFormula} a $rdf.graph() database instance with parsed RDF
 */
export async function text2graph(text, url, contentType) {
    return new Promise((resolve, reject) => {
        contentType = contentType || guessFileType(url)
        var graph = rdflib.graph();
        try {
            rdflib.parse(text, graph, url, contentType);
            resolve(graph);
        } catch (err) {
            reject(err)
        }
    })
}

/*cjs*/ function guessFileType(url) {
    const ext = url.replace(/.*\./, '');
    if (ext.match(/\/$/)) return folderType;
    if (ext.match(/(md|markdown)/)) return 'text/markdown';
    if (ext.match(/html/)) return 'text/html';
    if (ext.match(/xml/)) return 'text/xml';
    if (ext.match(/ttl/)) return 'text/turtle';
    if (ext.match(/n3/)) return 'text/n3';
    if (ext.match(/rq/)) return 'application/sparql';
    if (ext.match(/css/)) return 'text/css';
    if (ext.match(/txt/)) return 'text/plain';
    if (ext.match(/json/)) return 'application/json';
    if (ext.match(/js/)) return 'application/javascript';
    if (ext.match(/(png|gif|jpeg|tif)/)) return 'image';
    if (ext.match(/(mp3|aif|ogg)/)) return 'audio';
    if (ext.match(/(avi|mp4|mpeg)/)) return 'video';
    /* default */ return 'text/turtle';
}
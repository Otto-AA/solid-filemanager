// Based on https://github.com/jeff-zucker/solid-file-client/blob/master/src/folderUtils.js
import * as rdflib from 'rdflib';

const folderType = 'dir';
const fileType = 'file';

export function getStats(graph, subjectName) {
    const subjectNode = rdflib.sym(subjectName);
    const mod = rdflib.sym('http://purl.org/dc/terms/modified');
    const size = rdflib.sym('http://www.w3.org/ns/posix/stat#size');
    const mtime = rdflib.sym('http://www.w3.org/ns/posix/stat#mtime');
    let modified = graph.any(subjectNode, mod, undefined);
    if (typeof (modified) === "undefined") return false;
    else modified = modified.value;
    return {
        modified: modified,
        size: graph.any(subjectNode, size, undefined).value,
        mtime: graph.any(subjectNode, mtime, undefined).value,
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
    const items = graph.each(
        rdflib.sym(subj),
        rdflib.sym('http://www.w3.org/ns/ldp#contains'),
        undefined
    ).map(item => {
        let newItem = {}
        newItem.type = getFileType(graph, item.value)
        const stats = getStats(graph, item.value)
        newItem.modified = stats.modified
        newItem.size = stats.size
        newItem.mtime = stats.mtime
        newItem.label = decodeURIComponent(item.value).replace(/.*\//, '')

        if (newItem.type === folderType) {
            item.value = item.value.replace(/[/]+/g, '/');
            item.value = item.value.replace(/https:/, 'https:/');
            const name = item.value.replace(/\/$/, '')
            newItem.name = name.replace(/.*\//, '')
            newItem.url = item.value
        }
        else {
            newItem.url = item.value
            newItem.name = item.value.replace(/.*\//, '')
        }

        return newItem;
    });

    return items;
}
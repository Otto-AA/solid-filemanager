// Based on https://github.com/jeff-zucker/solid-file-client/blob/master/src/folderUtils
import * as rdflib from 'rdflib';
import { FileItem, FolderItem } from './Item';
import { FolderItems } from './types';

export function getSizeByGraph(graph: rdflib.IndexedFormula, subjectName: string): string | undefined {
    const subjectNode = rdflib.sym(subjectName);
    const nsSize = rdflib.sym('http://www.w3.org/ns/posix/stat#size');
    const size = graph.any(subjectNode, nsSize, undefined, undefined);

    return (size && 'value' in size) ? size.value : undefined;
}

/**
 * @param {rdflib.IndexedFormula} graph a rdflib.graph() database instance
 * @param {string} baseUrl location of the folder
 * @returns {boolean}
 */
export function isFolder(graph: rdflib.IndexedFormula, baseUrl: string): boolean {
    const folderNode = rdflib.sym(baseUrl);
    const isAnInstanceOfClass = rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const types = graph.each(folderNode, isAnInstanceOfClass, undefined, undefined);
    return Object.values(types)
        .some(({ value }) => value.match('ldp#BasicContainer') !== null);
}

export function getFolderItems(graph: rdflib.IndexedFormula, subj: string): FolderItems {
    const files: FileItem[] = [];
    const folders: FolderItem[] = [];

    graph.each(
        rdflib.sym(subj),
        rdflib.sym('http://www.w3.org/ns/ldp#contains'),
        undefined,
        undefined
    ).forEach(item => {
        const url = item.value;
        const size = getSizeByGraph(graph, url);

        if (isFolder(graph, url))
            folders.push(new FolderItem(url, size));
        else
            files.push(new FileItem(url, size));
    });

    return { files, folders };
}

/**
 * @param {string} text RDF text that can be passed to $rdf.parse()
 * @param {string} baseUrl the base url of the item
 * @param {string} contentType Content-Type of the request
 * @returns {Promise<rdflib.IndexedFormula>} a rdfilb.graph() database instance with parsed RDF
 */
export async function text2graph(text: string, baseUrl: string, contentType: string = ''): Promise<rdflib.IndexedFormula> {
    contentType = contentType || guessFileType(baseUrl);
    const graph = rdflib.graph();

    return new Promise((resolve, reject) => {
        rdflib.parse(text, graph, baseUrl, contentType, () => {});
        resolve(graph);
    });
}

function guessFileType(url: string): string {
    const ext = url.replace(/.*\./, '');
    if (ext.match(/\/$/)) return 'dir';
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

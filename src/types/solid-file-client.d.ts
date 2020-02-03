declare module "solid-file-client" {
  export = SFC.SolidFileClient
}

namespace SFC {
  /*~ Write your module's methods and properties in this class */
  declare class SolidFileClient {
    readonly static public LINKS = SFC.LINKS;
    readonly static public MERGE = SFC.MERGE;
    readonly static public AGENT = SFC.AGENT;

    constructor(auth: SolidAuthClient, options?: SolidFileClientOptions);

    readFile(url: string, request: RequestInit): Promise<Blob | string | Response>;
    readHead(url: string, request: RequestInit): Promise<string>;
    deleteFile(url: string): Promise<Response>;
    deleteFolder(url: string): Promise<Response>;

    fetch(url: string, options?: RequestInit): Promise<Response>;
    get(url: string, options?: RequestInit): Promise<Response>;
    delete(url: string, options?: RequestInit): Promise<Response>;
    post(url: string, options?: RequestInit): Promise<Response>;
    put(url: string, options?: RequestInit): Promise<Response>;
    patch(url: string, options?: RequestInit): Promise<Response>;
    head(url: string, options?: RequestInit): Promise<Response>;
    options(url: string, options?: RequestInit): Promise<Response>;

    itemExists(url: string): Promise<boolean>;
    postItem(url: string, content: FileContent, contentType: string, link: string, options?: WriteOptions): Promise<Response>;
    postFile(url: string, content: FileContent, contentType: string, options?: WriteOptions): Promise<Response>;
    putFile(url: string, content: FileContent, contentType: string, options?: WriteOptions): Promise<Response>;
    createFolder(url: string, options?: WriteOptions): Promise<Response>;

    readFolder(url: string, options?: ReadFolderOptions): Promise<FolderData>;
    getItemLinks(url: string, options?: ReadFolderOptions): Promise<Links>;

    copyFile(from: string, to: string, options?: WriteOptions): Promise<Response>;
    copyFolder(from: string, to: string, options?: WriteOptions): Promise<Response[]>;
    copy(from: string, to: string, options?: WriteOptions): Promise<Response|Response[]>;
    move(from: string, to: string, options?: WriteOptions): Promise<Response|Response[]>;
    rename(url: string, newName: string, options?: WriteOptions): Promise<Response|Response[]>;

    copyMetaFileForItem(oldTargetFile: string, newTargetFile: string, options?: WriteOptions): Promise<Response?>;
    copyAclFileForItem(oldTargetFile: string, newTargetFile: string, options?: WriteOptions): Promise<Response?>;
    copyLinksForItem(oldTargetFile: string, newTargetFile: string, options?: WriteOptions): Promise<Response[]>;

    deleteFolderContents(url: string): Promise<Response>;
    deleteFolderRecursively(url: string): Promise<Response>;
  }

  interface SolidFileClientOptions {
    enableLogging?: boolean | string;
  }

  type FileContent = Blob | string;

  enum MERGE {
    REPLACE = 'replace',
    KEEP_SOURCE = 'keep_source',
    KEEP_TARGET = 'keep_target'
  }

  enum LINKS {
    EXCLUDE = 'exlude',
    INCLUDE = 'include',
    INCLUDE_POSSIBLE = 'include_possible'
  }

  enum AGENT {
    NO_MODIFY = 'no_modify',
    TO_TARGET = 'to_target',
    TO_SOURCE = 'to_source'
  }

  interface WriteOptions {
    withAcl?: boolean;
    withMeta?: boolean;
    createPath?: boolean;
    agent?: AGENT;
    merge?: MERGE;
  }

  interface ReadFolderOptions {
    links?: LINKS;
  }

  interface SolidApiOptions {
    enableLogging?: string | boolean;
  }

  interface Links {
    acl?: string;
    meta?: string;
  }

  interface Item {
    url: string;
    name: string;
    parent: string;
    itemType: 'Container' | 'Resource';
    links?: Links;
  }

  interface FolderData {
    url: string;
    name: string;
    parent: string;
    links: Links;
    type: 'folder';
    folders: Item[];
    files: Item[];
  }
}























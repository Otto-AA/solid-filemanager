import { FileItem, FolderItem } from "./Item";

export interface FolderItems {
    files: FileItem[],
    folders: FolderItem[]
};
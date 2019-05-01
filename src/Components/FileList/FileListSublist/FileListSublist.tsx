import React from 'react';
import FileSublist from '../../File/FileSublist/FileSublist'; 
import Loader from '../../Loader/Loader'; 
import FileListEmptyMessage from '../FileListEmptyMessage';
import './FileListSublist.css'; 
import { FolderItem } from '../../../Api/Item';

function FileListSublist(props: OwnProps) {
    const { items, isLoading, handleOpenFolder } = props;
    
    const itemComponents = items.map((item, key) => {
        return <FileSublist
            item={item}
            isSelected={false}
            handleClick={() => handleOpenFolder(item)}
            handleDoubleClick={() => handleOpenFolder(item)}
            key={key} />
    });

    return <div className="FileListSublist">
        { isLoading ? 
            <Loader /> : 
            itemComponents.length ? itemComponents : <FileListEmptyMessage />
        }
    </div>
}

interface OwnProps {
    items: FolderItem[];
    isLoading: boolean;
    handleOpenFolder(folder: FolderItem): void;
}

export default FileListSublist;
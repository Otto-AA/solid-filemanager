import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import blue from '@material-ui/core/colors/blue';
import '../File.css';
import { FileItem, Item } from '../../../Api/Item';

// TODO: Check main differences between normal File.tsx component
function FileSublist(props: OwnProps) {
    const { item, isSelected, handleClick, handleDoubleClick } = props;
    const avatarStyle = {
        backgroundColor: isSelected ? blue['A200'] : undefined
    };
    return (
        <div className="File" onClick={handleClick} data-selected={isSelected} onDoubleClick={handleDoubleClick}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar style={avatarStyle}>
                        { (item instanceof FileItem) ? <FileIcon /> : <FolderIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary="" />
            </ListItem>
        </div>
    );
}

interface OwnProps {
    item: Item;
    isSelected: boolean;
    handleClick(): void;
    handleDoubleClick(): void;
}

export default FileSublist;


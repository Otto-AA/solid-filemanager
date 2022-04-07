import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import { getHumanFileSize } from '../../Api/Item';

function UploadFileList(props: UploadFileListProps) {
    const { files } = props;
    const list = Array.from(files).map((f, i) =>
        <ListItem dense key={i}>
            <ListItemIcon>
                <FileIcon />
            </ListItemIcon>
            <ListItemText primary={`${f.name} (${getHumanFileSize(f.size)})`} />
        </ListItem>
    );

    return (
        <div>
            <List component="nav">
                {list}
            </List>
        </div>
    );
}

interface UploadFileListProps {
    files: FileList;
}

export default UploadFileList;

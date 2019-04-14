import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setContextMenuVisible, toggleSelectedFile, setContextMenuPosition,
    setSelectedFileFromLastTo, loadAndEditFile, loadAndDisplayFile, displaySelectedMediaFile,
    rightClickOnFile, setSelectedItems, enterFolderByItem
} from '../../Actions/Actions.js';
import './File.css';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import blue from '@material-ui/core/colors/blue';
import { FileItem } from '../../Api/Item.js';

class File extends Component {
    render() {
        const { isSelected, item, handleClick, handleDoubleClick, handleContextMenu } = this.props;
        const avatarStyle = {
            backgroundColor: isSelected ? blue['A200'] : null
        };
        const realSize = (item instanceof FileItem) ? item.getDisplaySize() : null;
        return (
            <div className="File" onClick={handleClick} onDoubleClick={handleDoubleClick} onContextMenu={handleContextMenu} data-selected={isSelected}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={avatarStyle}>
                            { (item instanceof FileItem) ? <FileIcon /> : <FolderIcon />}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText className="filename" primary={item.getDisplayName()} secondary={realSize} />
                </ListItem>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isSelected: state.selectedItems.some(item => item.equals(ownProps.item))
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        /**
         * @param {Object} event
         * @returns {undefined}
         */
        handleDoubleClick: (event) => {
            const item = ownProps.item;

            if (item instanceof FileItem) {
                if (item.isEditable())
                    dispatch(loadAndEditFile(item.name));
                else if (item.isImage())
                    dispatch(loadAndDisplayFile(item.name));
                else if (item.isMedia())
                    dispatch(displaySelectedMediaFile());
            }
            else
                dispatch(enterFolderByItem(item));
        },

        /**
         * @param {Object} event
         * @returns {undefined}
         */
        handleContextMenu: (event) => {
            event.preventDefault();
            event.stopPropagation();

            const x = event.clientX || (event.touches && event.touches[0].pageX);
            const y = event.clientY || (event.touches && event.touches[0].pageY);

            if (event.shiftKey) {
                dispatch(setSelectedFileFromLastTo(ownProps.item));
            } else {
                dispatch(rightClickOnFile(ownProps.item));
            }
            
            dispatch(setContextMenuVisible(true));
            dispatch(setContextMenuPosition(x, y));
        },

        /**
         * @param {Object} event
         * @returns {undefined}
         */
        handleClick: (event) => {
            event.stopPropagation();

            if (event.ctrlKey) {
                dispatch(toggleSelectedFile(ownProps.item));
            } else if (event.shiftKey) {
                dispatch(setSelectedFileFromLastTo(ownProps.item));
            } else {
                dispatch(setSelectedItems([ownProps.item]));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(File);
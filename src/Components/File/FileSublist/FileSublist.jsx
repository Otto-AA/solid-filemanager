import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    setSelectedFolderSublist, enterToDirectorySublist 
} from '../../../Actions/Actions.js';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import blue from '@material-ui/core/colors/blue';
import '../File.css';
import { FileItem } from '../../../Api/Item.js';

const styles = theme => ({
});


class FileSublist extends Component {
    render() {
        const { item, handleClick, isSelected, handleDoubleClick } = this.props;
        const avatarStyle = {
            backgroundColor: isSelected ? blue['A200'] : null
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
}


const mapStateToProps = (state, ownProps) => {
    return {
        isSelected: state.selectedFolderSublist && (state.selectedFolderSublist.equals(ownProps.item))
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        /**
         * @param {Object} event
         * @returns {undefined}
         */
        handleDoubleClick: (event) => {
            dispatch(enterToDirectorySublist(ownProps.item.name));
            dispatch(setSelectedFolderSublist(null));
        },

        /**
         * @param {Object} event
         * @returns {undefined}
         */
        handleClick: (event) => {
            event.stopPropagation();
            dispatch(setSelectedFolderSublist(ownProps.item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileSublist));


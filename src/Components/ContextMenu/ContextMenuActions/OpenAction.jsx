import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { loadAndDisplayFile, displayMediaFile, loadAndEditFile, enterToDirectory } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import config from '../../../config.js';

function OpenAction(props) {
    const {handleClick, selectedFiles} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedFiles)}>
            <ListItemIcon>
                <OpenInBrowserIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Open
            </Typography>
        </MenuItem>        
    );
}

const mapStateToProps = (state) => {
    return {
        selectedFiles: state.selectedFiles
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event, selectedFiles) => {
            const file = selectedFiles[0];
            if (file.type === 'dir') {
                dispatch(enterToDirectory(file.name));
                return;
            }

            if (config.isEditableFilePattern.test(file.name) || file.editable) {
                dispatch(loadAndEditFile(file.name));
            } else if (config.isImageFilePattern.test(file.name)) {
                dispatch(loadAndDisplayFile(file.name));
            } else if (config.isMediaFilePattern.test(file.name)) {
                dispatch(displayMediaFile(file.name));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenAction);

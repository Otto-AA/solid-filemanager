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
            if (selectedFiles[0].type === 'dir') {
                dispatch(enterToDirectory(selectedFiles[0].name));
                return;
            }

            if (config.isEditableFilePattern.test(ownProps.name) || ownProps.editable) {
                dispatch(loadAndEditFile(ownProps.name));
            } else if (config.isImageFilePattern.test(ownProps.name)) {
                dispatch(loadAndDisplayFile(ownProps.name));
            } else if (config.isMediaFilePattern.test(ownProps.name)) {
                dispatch(displayMediaFile(ownProps.name));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenAction);

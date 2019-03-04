import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { setVisibleDialogCreateFile } from '../../../Actions/Actions.js';

function CreateFileAction(props) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback) => (event) => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <InsertDriveFileIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Create file
            </Typography>
        </MenuItem>        
    );
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event) => {
            dispatch(setVisibleDialogCreateFile(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFileAction);

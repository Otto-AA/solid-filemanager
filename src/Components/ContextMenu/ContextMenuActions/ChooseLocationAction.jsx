import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FolderSharedIcon from '@material-ui/icons/FolderSharedOutlined';
import { setVisibleDialogChooseLocation } from '../../../Actions/Actions.js';

function ChooseLocationAction(props) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback) => (event) => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <FolderSharedIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Choose root location
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
            dispatch(setVisibleDialogChooseLocation(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseLocationAction);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import { setVisibleDialogSolidLogout } from '../../../Actions/Actions.js';

function SolidLogoutAction(props) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback) => (event) => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <ClearIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Logout
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
            dispatch(setVisibleDialogSolidLogout(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SolidLogoutAction);

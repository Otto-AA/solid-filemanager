import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { setVisibleDialogSolidLogin } from '../../../Actions/Actions.js';

function SolidLoginAction(props) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback) => (event) => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <PermIdentityIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Login
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
            dispatch(setVisibleDialogSolidLogin(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SolidLoginAction);

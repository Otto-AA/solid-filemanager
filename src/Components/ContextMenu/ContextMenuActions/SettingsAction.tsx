import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';
import { Settings } from '@material-ui/icons';

function ChooseLocationAction(props: ChooseLocationActionProps) {
    const { handleClick, handleClose } = props;

    const handleCloseAfter = (callback: () => void) => () => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <Settings />
            </ListItemIcon>
            <Typography variant="inherit">
                Settings
            </Typography>
        </MenuItem>
    );
}

interface ChooseLocationActionProps {
    handleClick(): void;
    handleClose(): void;
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: () => {
            dispatch(openDialog(DIALOGS.SETTINGS));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseLocationAction);

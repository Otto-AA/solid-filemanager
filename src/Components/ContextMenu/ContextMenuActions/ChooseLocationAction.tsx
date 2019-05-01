import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FolderSharedIcon from '@material-ui/icons/FolderSharedOutlined';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

function ChooseLocationAction(props: ChooseLocationActionProps) {
    const { handleClick, handleClose } = props;

    const handleCloseAfter = (callback: () => void) => () => {
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
            dispatch(openDialog(DIALOGS.CHOOSE_LOCATION));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseLocationAction);

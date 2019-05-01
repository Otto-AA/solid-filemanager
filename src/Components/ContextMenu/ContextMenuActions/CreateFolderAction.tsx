import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

function CreateFolderAction(props: CreateFolderActionProps) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback: () => void) => () => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <CreateNewFolderIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Create folder
            </Typography>
        </MenuItem>        
    );
}

interface CreateFolderActionProps {
    handleClick(): void;
    handleClose(): void;
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: () => {
            dispatch(openDialog(DIALOGS.CREATE_FOLDER));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFolderAction);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

function CreateFileAction(props: CreateFileActionProps) {
    const {handleClick, handleClose} = props;

    const handleCloseAfter = (callback: () => void) => () => {
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

interface CreateFileActionProps {
    handleClick(): void;
    handleClose(): void;
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: () => {
            dispatch(openDialog(DIALOGS.CREATE_FILE));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFileAction);

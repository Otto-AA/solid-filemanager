import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

function UploadFileAction(props: UploadFileActionProps) {
    const { handleClick, handleClose } = props;

    const handleCloseAfter = (callback: () => void) => () => {
        callback();
        handleClose();
    };

    return (
        <MenuItem onClick={handleCloseAfter(handleClick)}>
            <ListItemIcon>
                <CloudUploadIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Upload files
            </Typography>
        </MenuItem>        
    );
}

interface UploadFileActionProps {
    handleClick(): void;
    handleClose(): void;
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: () => {
            dispatch(openDialog(DIALOGS.UPLOAD_FILE));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileAction);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { openDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

function CopyAction(props: CopyActionProps) {
    const { handleClick } = props;

    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon>
                <FileCopyIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Copy
            </Typography>
        </MenuItem>        
    );
}

interface CopyActionProps {
    handleClick(): void;
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: () => {
            dispatch(openDialog(DIALOGS.COPY));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyAction);

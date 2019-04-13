import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { initSubList, setVisibleDialogCopy } from '../../../Actions/Actions.js';

function CopyAction(props) {
    const {handleClick} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e)}>
            <ListItemIcon>
                <FileCopyIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Copy
            </Typography>
        </MenuItem>        
    );
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event) => {
            dispatch(initSubList());
            dispatch(setVisibleDialogCopy(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyAction);

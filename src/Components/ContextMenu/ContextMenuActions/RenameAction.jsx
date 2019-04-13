import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import WrapTextIcon from '@material-ui/icons/WrapText';
import { setVisibleDialogRename } from '../../../Actions/Actions.js';

function MoveAction(props) {
    const {handleClick} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e)}>
            <ListItemIcon>
                <WrapTextIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Rename
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
            dispatch(setVisibleDialogRename(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveAction);

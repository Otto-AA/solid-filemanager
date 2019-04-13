import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { removeItems } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

function RemoveAction(props) {
    const {handleClick, selectedItems} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Remove
            </Typography>
        </MenuItem>        
    );
}

const mapStateToProps = (state) => {
    return {
        selectedItems: state.selectedItems
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event, selectedItems) => {
            dispatch(removeItems(selectedItems));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveAction);

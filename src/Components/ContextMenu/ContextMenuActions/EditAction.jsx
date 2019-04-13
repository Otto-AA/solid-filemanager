import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { loadAndEditFile } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

function OpenAction(props) {
    const {handleClick, selectedItems} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
            <ListItemIcon>
                <OpenInBrowserIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Edit
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
            dispatch(loadAndEditFile(selectedItems[0].name));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenAction);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { extractZipFile } from '../../../Actions/Actions.js';

function ExtractAction(props) {
    const {handleClick, selectedItems} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
            <ListItemIcon>
                <UnarchiveIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Extract here
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
            dispatch(extractZipFile(selectedItems[0].name));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtractAction);

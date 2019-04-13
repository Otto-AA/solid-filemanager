import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ArchiveIcon from '@material-ui/icons/Archive';
import { zipAndUpload } from '../../../Actions/Actions.js';

function ZipAction(props) {
    const {handleClick, selectedItems} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
            <ListItemIcon>
                <ArchiveIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Zip here
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
            dispatch(zipAndUpload(selectedItems));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZipAction);

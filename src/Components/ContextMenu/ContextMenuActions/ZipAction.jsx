import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ArchiveIcon from '@material-ui/icons/Archive';
import { zipAndUpload } from '../../../Actions/Actions.js';

function ZipAction(props) {
    const {handleClick, selectedFiles} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e, selectedFiles)}>
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
        selectedFiles: state.selectedFiles
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event, selectedFiles) => {
            dispatch(zipAndUpload(selectedFiles));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZipAction);

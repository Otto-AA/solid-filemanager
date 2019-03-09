import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { extractZipFile } from '../../../Actions/Actions.js';

function ExtractAction(props) {
    const {handleClick, selectedFiles} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e, selectedFiles)}>
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
        selectedFiles: state.selectedFiles
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event, selectedFiles) => {
            dispatch(extractZipFile(selectedFiles[0].name));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtractAction);

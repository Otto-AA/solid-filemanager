import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { openInNewTab } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import LinkIcon from '@material-ui/icons/Link';

function OpenInNewTabAction(props) {
    const {handleClick, selectedFiles} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedFiles)}>
            <ListItemIcon>
                <LinkIcon   />
            </ListItemIcon>
            <Typography variant="inherit">
                Open in new Tab
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
            dispatch(openInNewTab(selectedFiles[0].name));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenInNewTabAction);

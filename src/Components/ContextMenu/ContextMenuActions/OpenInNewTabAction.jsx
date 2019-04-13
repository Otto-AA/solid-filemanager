import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { openInNewTab } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import LinkIcon from '@material-ui/icons/Link';

function OpenInNewTabAction(props) {
    const {handleClick, selectedItems} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
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
        selectedItems: state.selectedItems
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event, selectedItems) => {
            dispatch(openInNewTab(selectedItems[0]));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenInNewTabAction);

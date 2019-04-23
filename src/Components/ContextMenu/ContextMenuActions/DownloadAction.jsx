import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { downloadItems } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { FileItem } from '../../../Api/Item';

function DownloadAction(props) {
    const {handleClick, selectedItems} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedItems)}>
            <ListItemIcon>
                <CloudDownloadIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                {(selectedItems.length === 1 && selectedItems[0] instanceof FileItem) ? 
                    'Download'
                    : 'Download Zip'
                }
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
            dispatch(downloadItems(selectedItems));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadAction);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { downloadItems } from '../../../Actions/Actions.js';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

function DownloadAction(props) {
    const {handleClick, selectedFiles} = props;
    return (
        <MenuItem onClick={(e) => handleClick(e, selectedFiles)}>
            <ListItemIcon>
                <CloudDownloadIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                {(selectedFiles.length === 1 && selectedFiles[0].type === 'file') ? 
                    'Download'
                    : 'Download Zip'
                }
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
            dispatch(downloadItems(selectedFiles));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadAction);

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { setVisibleDialogMedia } from '../../../Actions/Actions.js';
import config from '../../../config.js';
import Plyr from 'react-plyr';
import 'plyr/dist/plyr.css';

class FormDialog extends Component {
    render() {
        const { fileName, url, provider, type, handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-display-media" fullWidth={true} maxWidth={'lg'}>
                <DialogTitle id="form-dialog-display-media">Display Media</DialogTitle>
                <DialogContent>
                    <p>Playing {fileName}</p>
                    <Plyr type={type} provider={provider} url={url} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    const open = state.visibleDialogMedia;

    if (state.selectedFiles.length) {
        const fileName = state.selectedFiles[0].name;
        const path = state.path;
        const url = `${config.getHost()}/${path.length ? (path.join('/') + '/') : ''}${fileName}`;
        const provider = config.isVideoFilePattern.test(fileName) ? 'html5' : 'audio';
        const type = config.isVideoFilePattern.test(fileName) ? 'video' : 'audio';

        return {
            fileName,
            url,
            provider,
            type,
            open
        };
    }
    else {
        return {
            open
        };
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogMedia(false));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

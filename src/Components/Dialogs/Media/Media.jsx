import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { setVisibleDialogMedia } from '../../../Actions/Actions.js';
import Plyr from 'react-plyr';
import 'plyr/dist/plyr.css';
import { FileItem } from '../../../Api/Item.js';

class FormDialog extends Component {
    render() {
        const { fileName, url, provider, type, handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-display-media" fullWidth={true} maxWidth={'lg'}>
                <DialogTitle id="form-dialog-display-media">Display Media</DialogTitle>
                <DialogContent>
                    <p>Playing {fileName}</p>
                    <Plyr type={type} provider={provider} url={url} iconUrl="./vendor/plyr/plyr.svg" />
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

    const file = state.selectedItems[0];   

    if (file instanceof FileItem) {
            return {
                open,
                fileName: file.name,
                url: file.url,
                provider: file.isVideo() ? 'html5' : 'audio',
                type: file.isVideo() ? 'video' : 'audio',
            };
    }
    else
        return { open };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogMedia(false));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

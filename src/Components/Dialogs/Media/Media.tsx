import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { MyDispatch, closeDialog } from '../../../Actions/Actions';
import Plyr from 'react-plyr';
import 'plyr/dist/plyr.css';
import { FileItem } from '../../../Api/Item';
import { DialogStateProps, DialogDispatchProps } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<MediaProps> {
    render() {
        const { file, handleClose, open } = this.props;

        const fileName = file ? file.name : undefined;
        const url = file ? file.url : undefined;
        // TODO: const provider = file ? (file.isVideo() ? 'html5' : 'audio') : '';
        const type = file ? (file.isVideo() ? 'video' : 'audio') : undefined;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-display-media" fullWidth={true} maxWidth={'lg'}>
                <DialogTitle id="form-dialog-display-media">Display Media</DialogTitle>
                <DialogContent>
                    {
                        file ?
                            (
                                <div>
                                    <p>Playing {fileName}</p>
                                    <Plyr type={type} /*TODO: provider={provider}*/ url={url} iconUrl="./vendor/plyr/plyr.svg" />
                                </div>
                            )
                            : <p>No media file opened</p>
                            
                    }
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

interface StateProps extends DialogStateProps {
    file?: FileItem;
}
interface MediaProps extends StateProps, DialogDispatchProps {}


const mapStateToProps = (state: AppState): StateProps => {
    const open = state.visibleDialogs.MEDIA;

    const file = state.items.selected[0];   

    if (file instanceof FileItem) {
            return {
                open,
                file,
            };
    }
    return { open };
};

const mapDispatchToProps = (dispatch: MyDispatch): DialogDispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.MEDIA));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

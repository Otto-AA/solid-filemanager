import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { closeDialog, MyDispatch } from '../../../Actions/Actions';
import { DialogStateProps, DialogDispatchProps } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<ContentProps> {

    state = {
        lastBlobUrl: null,
        content: '...',
        loading: false
    };

    componentDidUpdate() {
        if (this.props.blobUrl !== this.state.lastBlobUrl) {
            this.setState({
                lastBlobUrl: this.props.blobUrl
            });
            this.setState({
                loading: true
            });
        }
    }

    render() {
        const { handleClose, open } = this.props;
        return (
          <div style={{marginLeft:'1em'}}>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-content" fullWidth={true} maxWidth={'sm'}>
              <DialogTitle id="form-dialog-content">Viewing file </DialogTitle>
              <DialogContent>
                <img src={this.props.blobUrl} alt="" style={{maxWidth: '100%'}}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" type="button">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
    }
}

interface StateProps extends DialogStateProps {
    blobUrl: string | undefined;
}
interface DispatchProps extends DialogDispatchProps {}
interface ContentProps extends StateProps, DispatchProps {}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.CONTENT,
        blobUrl: state.blob || undefined
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DialogDispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.CONTENT));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

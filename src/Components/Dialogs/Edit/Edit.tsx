import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { updateTextFile, MyDispatch, closeDialog } from '../../../Actions/Actions';
import { DialogStateProps, DialogDispatchProps, DialogButtonClickEvent } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<EditProps> {
    state = {
        lastBlobUrl: null as string|null,
        content: null as string|null,
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

            this.props.blobUrl && fetch(this.props.blobUrl).then(r => {
                return r.text();
            }).then(t => {
                this.setState({
                    content: t
                });
                this.setState({
                    loading: false
                });
            });
        }
    }

    handleSave(event: DialogButtonClickEvent) {
        event.preventDefault();
        const textarea = event.currentTarget.querySelector('textarea');
        if (textarea) {
            const content = textarea.value;
            this.props.handleSubmit(event, {
                itemName: this.props.itemName,
                content
            });
        }
    }

    render() {
        const { handleClose, open } = this.props;
        const textAreaStyle = {
            width: '100%',
            minHeight: '300px'
        };
        const textArea = <textarea style={textAreaStyle} defaultValue={this.state.content || ''} />;

        return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-edit" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-edit">Editing file </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {this.state.loading ? 'Loading...' : textArea}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Close
                    </Button>
                    <Button color="primary" onClick={this.handleSave.bind(this)} type="submit">
                      Update
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </div>
        );
    }
}

interface StateProps extends DialogStateProps {
    itemName: string;
    blobUrl: string;
}
interface DispatchProps extends DialogDispatchProps {
    handleSubmit(event: DialogButtonClickEvent, { itemName, content }: { itemName: string, content: string }): void;
}
interface EditProps extends StateProps, DispatchProps {}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.EDIT, // TODO: rename visibleDialogs (e.g. to dialogIsOpen)
        itemName: state.items.selected.length ? state.items.selected[0].name : '',
        blobUrl: state.blob || ''
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.EDIT));
        },
        handleSubmit: (event, { itemName, content }) => {
            dispatch(updateTextFile(itemName, new Blob([content])));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

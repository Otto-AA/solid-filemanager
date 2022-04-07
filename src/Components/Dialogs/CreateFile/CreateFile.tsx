import React, { Component, createRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { createFile, closeDialog, MyDispatch } from '../../../Actions/Actions';
import { AppState } from '../../../Reducers/reducer';
import { DialogStateProps, DialogDispatchProps, DialogButtonClickEvent } from '../dialogTypes';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<CreateFileProps> {
    private textField: React.RefObject<HTMLInputElement> = createRef();

    handleSubmit(event: DialogButtonClickEvent) {
        const textField = this.textField.current;
        if (textField) {
            const fileName = textField.value;
            this.props.handleSubmit(event, { fileName });
        }
    }

    render() {
        const { handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-create-file" fullWidth={true} maxWidth={'sm'}>
                <form>
                    <DialogTitle id="form-dialog-create-file">Create file</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus fullWidth margin="dense" label="File name" type="text" inputRef={this.textField}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" type="button">
                            Cancel
                    </Button>
                        <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>
                            Create
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

interface DispatchProps extends DialogDispatchProps {
    handleSubmit(event: DialogButtonClickEvent, { fileName }: { fileName: string }): void;
}
interface CreateFileProps extends DialogStateProps, DispatchProps { }

const mapStateToProps = (state: AppState): DialogStateProps => {
    return {
        open: state.visibleDialogs.CREATE_FILE
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.CREATE_FILE));
        },
        handleSubmit: (event, { fileName }) => {
            event.preventDefault();
            dispatch(createFile(fileName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

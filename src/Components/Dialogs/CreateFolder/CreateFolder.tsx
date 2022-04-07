import React, { Component, createRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { createNewFolder, closeDialog, MyDispatch } from '../../../Actions/Actions';
import { DialogStateProps, DialogDispatchProps, DialogButtonClickEvent } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<CreateFolderProps> {
    private textField: React.RefObject<HTMLInputElement> = createRef();

    handleSubmit(event: DialogButtonClickEvent) {
        const textField = this.textField.current;
        if (textField) {
            const folderName = textField.value;
            this.props.handleSubmit(event, { folderName });
        }
    }

    render() {
        const { handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-create-folder" fullWidth={true} maxWidth={'sm'}>
                <form>
                    <DialogTitle id="form-dialog-create-folder">Create folder</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus fullWidth margin="dense" label="Folder name" type="text" inputRef={this.textField} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" type="button">
                            Cancel
                    </Button>
                        <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>
                            Save
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

interface DispatchProps extends DialogDispatchProps {
    handleSubmit(event: DialogButtonClickEvent, { folderName }: { folderName: string }): void;
}
interface CreateFolderProps extends DialogStateProps, DispatchProps { }

const mapStateToProps = (state: AppState): DialogStateProps => {
    return {
        open: state.visibleDialogs.CREATE_FOLDER
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.CREATE_FOLDER));
        },
        handleSubmit: (event, { folderName }) => {
            event.preventDefault();
            dispatch(createNewFolder(folderName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

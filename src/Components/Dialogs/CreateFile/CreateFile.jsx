import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { createFile, setVisibleDialogCreateFile } from '../../../Actions/Actions.js';

class FormDialog extends Component {

    render() {
        const { handleClose, handleCreate, value, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-create-file" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-create-file">Create file</DialogTitle>
                  <DialogContent>
                    <TextField autoFocus fullWidth margin="dense" label="File name" type="text" value={value} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={handleCreate}>
                      Create
                    </Button>
                  </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: state.visibleDialogCreateFile
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogCreateFile(false));
        },
        handleCreate: event => {
            event.preventDefault();
            const fileName = event.currentTarget.form.querySelector('input').value;
            dispatch(createFile(fileName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

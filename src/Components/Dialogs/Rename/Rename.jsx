import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { renameFile, renameFolder, setVisibleDialogRename } from '../../../Actions/Actions.js';
import { FolderItem } from '../../../Api/Item';

class FormDialog extends Component {

    state = {
        value: ''
    };

    componentWillReceiveProps (props) {
        if (props.item !== null)
            this.setState({value: props.item.name});
    }

    handleChange (event) {
        this.setState({value: event.currentTarget.form.querySelector('input').value});
    }

    handleSave (event) {
        this.props.handleSave(event)(this.props.item, this.state.value);
    }

    render() {
        const { value } = this.state;
        const { handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-create-folder" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-create-folder">Rename</DialogTitle>
                  <DialogContent>
                    <TextField autoFocus fullWidth margin="dense" label="Item name" type="text" onChange={this.handleChange.bind(this)} value={value} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={this.handleSave.bind(this)}>
                      Save
                    </Button>
                  </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: state.visibleDialogRename,
        item: state.selectedItems.length ? state.selectedItems[0] : null,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogRename(false));
        },
        handleSave: event => (item, newName) => {
            event.preventDefault();
            if (item instanceof FolderItem)
                dispatch(renameFolder(item.name, newName));
            else
                dispatch(renameFile(item.name, newName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

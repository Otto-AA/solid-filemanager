import React, { Component, createRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { renameFile, renameFolder, MyDispatch, closeDialog } from '../../../Actions/Actions';
import { FolderItem, Item } from '../../../Api/Item';
import { DialogStateProps, DialogDispatchProps, DialogButtonClickEvent } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';
class FormDialog extends Component<RenameProps> {
    private textField: React.RefObject<HTMLInputElement> = createRef();

    handleSubmit(event: DialogButtonClickEvent) {
        const textField = this.textField.current;
        const item = this.props.item;
        if (textField && item) {
            const newName = textField.value;
            this.props.handleSubmit(event, { item, newName });
        }
    }

    render() {
        const { handleClose, open, item } = this.props;
        const previousName = item ? item.name : '';

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-create-folder" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-create-folder">Rename</DialogTitle>
                  <DialogContent>
                    <TextField autoFocus fullWidth margin="dense" label="Item name" type="text" inputRef={this.textField} defaultValue={previousName} />
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

interface StateProps extends DialogStateProps {
    item?: Item;
}
interface DispatchProps extends DialogDispatchProps {
    handleSubmit(event: DialogButtonClickEvent, { item, newName }: { item: Item, newName: string }): void;
}
interface RenameProps extends StateProps, DispatchProps {}


const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.RENAME,
        item: state.items.selected[0],
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.RENAME));
        },
        handleSubmit: (event, { item, newName }) => {
            event.preventDefault();
            if (item instanceof FolderItem) // TODO: Create renameItem
                dispatch(renameFolder(item.name, newName));
            else
                dispatch(renameFile(item.name, newName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

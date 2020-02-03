import React, { Component, createRef } from 'react';
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
import { Item } from '../../../Api/Item';

class FormDialog extends Component<EditProps> {
    private textField: React.RefObject<HTMLTextAreaElement> = createRef();
    state = {
        lastBlobUrl: null as string|null,
        content: null as string|null,
        contentType: null as string|null,
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

            this.props.blobUrl && fetch(this.props.blobUrl).then(async r => {
                this.setState({
                    content: await r.text(),
                    contentType: r.headers.get('content-type')
                });
                this.setState({
                    loading: false
                });
            });
        }
    }

    handleSave(event: DialogButtonClickEvent) {
        event.preventDefault();
        const textField = this.textField.current;
        const item = this.props.item;
        if (textField && item) {
            const content = textField.value;
            const contentType = this.state.contentType ? this.state.contentType : 'text/plain';
            this.props.handleSubmit(event, {
                itemName: item.name,
                content,
                contentType
            });
        }
    }

    render() {
        const { handleClose, open, item } = this.props;
        const itemName = item ? item.getDisplayName() : 'No item selected';
        const textAreaStyle = {
            width: '100%',
            minHeight: '300px'
        };
        const textArea = <textarea style={textAreaStyle} defaultValue={this.state.content || ''} ref={this.textField} />;

        return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-edit" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-edit">Editing file: {itemName} </DialogTitle>
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
    item: Item;
    blobUrl: string;
}
interface DispatchProps extends DialogDispatchProps {
    handleSubmit(event: DialogButtonClickEvent, { itemName, content, contentType }: { itemName: string, content: string, contentType: string }): void;
}
interface EditProps extends StateProps, DispatchProps {}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.EDIT, // TODO: rename visibleDialogs (e.g. to dialogIsOpen)
        item: state.items.selected[0],
        blobUrl: state.blob || ''
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.EDIT));
        },
        handleSubmit: (event, { itemName, content, contentType }) => {
            dispatch(updateTextFile(itemName, content, contentType));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

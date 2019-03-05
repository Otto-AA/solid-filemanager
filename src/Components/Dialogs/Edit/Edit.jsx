import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { setVisibleDialogEdit, updateTextFile } from '../../../Actions/Actions.js';

class FormDialog extends Component {

    state = {
        lastBlobUrl: null,
        content: null,
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

    handleSave (event) {
        event.preventDefault();
        const content = event.currentTarget.form.querySelector('textarea').value;

        this.props.handleSave(event)(this.props.fileName, content);
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

const mapStateToProps = (state) => {
    return {
        open: state.visibleDialogEdit,
        fileName: state.selectedFiles.length ? state.selectedFiles[0].name : '',
        blobUrl: state.fileContentBlobUrl
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: (event) => {
            dispatch(setVisibleDialogEdit(false));
        },
        handleOpen: (event) => {
            dispatch(setVisibleDialogEdit(true));
        },
        handleSave: (event) => (fileName, content) => {
            dispatch(updateTextFile(fileName, content));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { solidLogin, setVisibleDialogSolidLogin } from '../../../Actions/Actions.js';

class FormDialog extends Component {

    render() {
        const { handleClose, handleLogin, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-solid-login" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-solid-login">Login to your Solid pod</DialogTitle>
                  <DialogContent>
                    <p>Please login to your solid pod to access this app by clicking the login button below.</p>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={handleLogin}>
                      Login
                    </Button>
                  </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        //createFolderName: state.createFolderName,
        open: state.visibleDialogSolidLogin
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogSolidLogin(false));
        },
        handleLogin: event => {
            event.preventDefault();
            dispatch(solidLogin());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

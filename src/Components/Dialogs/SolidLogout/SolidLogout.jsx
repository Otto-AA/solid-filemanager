import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { solidLogout, setVisibleDialogSolidLogout } from '../../../Actions/Actions.js';

class FormDialog extends Component {

    render() {
        const { handleClose, handleLogout, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-solid-logout" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-solid-logout">Logout from your Solid pod</DialogTitle>
                  <DialogContent>
                    <p>Please confirm logging out by clicking the Logout button below</p>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={handleLogout}>
                      Logout
                    </Button>
                  </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: state.visibleDialogSolidLogout
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogSolidLogout(false));
        },
        handleLogout: event => {
            event.preventDefault();
            dispatch(solidLogout());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

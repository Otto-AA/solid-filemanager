import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { solidLogin, setVisibleDialogSolidLogin, refreshFileList } from '../../../Actions/Actions.js';
import config from '../../../config.js';

class FormDialog extends Component {
    state = {
      storageLocation: null,
    };

    componentWillReceiveProps(props) {
      const { isLoggedIn, webId } = props;
      if (isLoggedIn) {
        const storageLocation = (new URL(webId)).origin;
        this.setState({ storageLocation });
      }
    }

    handleChange (event) {
      const storageLocation = event.currentTarget.form.querySelector('input').value;
      this.setState({ storageLocation });
    }

    handleSubmit (event) {
        this.props.handleSubmit(event)(this.state.storageLocation);
    }

    render() {
        let { storageLocation } = this.state;
        const { handleClose, handleLogin, open, isLoggedIn } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-solid-login" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-solid-login">Login to your Solid pod</DialogTitle>
                  <DialogContent>
                    <p>Please login to your solid pod to access this app by clicking the login button below.</p>
                    <Button color="primary" type="submit" onClick={handleLogin}>
                      Login
                    </Button>
                    {
                      isLoggedIn && (
                        <div>
                          <p>Please enter your pods storage location</p>
                          <TextField autoFocus fullWidth margin="dense" label="Storage Location" type="text" onChange={this.handleChange.bind(this)} value={storageLocation} />
                        </div>
                      )
                    }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>
                      Enter your Pod
                    </Button>
                  </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: state.visibleDialogSolidLogin,
        webId: state.webId,
        isLoggedIn: state.isLoggedIn
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
        },
        handleSubmit: event => (storageLocation) => {
            event.preventDefault();
            config.setHost(storageLocation);
            dispatch(setVisibleDialogSolidLogin(false));
            dispatch(refreshFileList());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

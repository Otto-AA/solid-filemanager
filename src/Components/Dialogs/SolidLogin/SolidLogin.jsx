import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { solidLogin, setVisibleDialogSolidLogin, setHost, enterFolder, getLocationObjectFromUrl } from '../../../Actions/Actions.js';

class FormDialog extends Component {
    state = {
      location: null,
    };

    componentWillReceiveProps(props) {
      const { isLoggedIn, webId } = props;
      const params = new URLSearchParams(document.location.search.substr(1));
      const encodedUrl = params.get('url');

      if (encodedUrl !== null) {
        const location = decodeURI(encodedUrl);
        this.setState({ location });
      }
      else if (isLoggedIn) {
        const location = (new URL(webId)).origin;
        this.setState({ location });
      }
    }

    handleChange (event) {
      const location = event.currentTarget.form.querySelector('input').value;
      this.setState({ location });
    }

    handleSubmit (event) {
        this.props.handleSubmit(event)(this.state.location);
    }

    render() {
        let { location } = this.state;
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
                          <p>Please enter the full url to the directory you want to open</p>
                          <TextField autoFocus fullWidth margin="dense" label="Directory Location" type="text" onChange={this.handleChange.bind(this)} value={location} />
                        </div>
                      )
                    }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)} disabled={!isLoggedIn}>
                      Open directory
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
        handleSubmit: event => (location) => {
            event.preventDefault();
            const { host, path } = getLocationObjectFromUrl(location);
            dispatch(setVisibleDialogSolidLogin(false));
            dispatch(setHost(host));
            dispatch(enterFolder(path));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

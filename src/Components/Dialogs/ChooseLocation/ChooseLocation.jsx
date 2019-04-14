import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { solidLogin, setVisibleDialogChooseLocation, setHost, enterFolder, getLocationObjectFromUrl, solidLogout, clearCache } from '../../../Actions/Actions.js';

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
        location = location ? location : '';
        const { handleClose, handleLogin, handleLogout, open, isLoggedIn, webId } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-choose-location" fullWidth={true} maxWidth={'sm'}>
                <form>
                  <DialogTitle id="form-dialog-choose-location">Choose the storage location</DialogTitle>
                  <DialogContent>
                    <Typography variant="body1" gutterBottom>
                      { !isLoggedIn ? 
                          "If you want to access private resources, please login with the button below."
                          : "Logged in as " + webId + "."
                      }
                    </Typography>
                    { !isLoggedIn ? 
                        <Button variant="outlined" color="primary" onClick={handleLogin}>Login</Button>
                        : <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                    }

                    <Typography variant="body1">
                      Please enter the directory you want to open below.
                    </Typography>
                    <TextField autoFocus fullWidth 
                      margin="normal" 
                      label="Storage Location" 
                      variant="outlined"
                      onChange={this.handleChange.bind(this)}
                      value={location} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" type="button">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>
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
        open: state.visibleDialogChooseLocation,
        webId: state.webId,
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClose: event => {
            dispatch(setVisibleDialogChooseLocation(false));
        },
        handleLogin: event => {
            event.preventDefault();
            dispatch(solidLogin());
        },
        handleLogout: event => {
            event.preventDefault();
            dispatch(solidLogout());
        },
        handleSubmit: event => (location) => {
            event.preventDefault();
            const { host, path } = getLocationObjectFromUrl(location);
            dispatch(setVisibleDialogChooseLocation(false));
            dispatch(setHost(host));
            dispatch(clearCache());
            dispatch(enterFolder(path));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { solidLogin, setHost, enterFolder, solidLogout, clearCache, MyDispatch, setErrorMessage, closeDialog } from '../../../Actions/Actions';
import { getLocationObjectFromUrl } from '../../HistoryHandler/HistoryHandler';
import { DialogButtonClickEvent, DialogDispatchProps, DialogStateProps } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

class FormDialog extends Component<ChooseLocationProps> {
    state = {
        location: '',
        oidcIssuer: '',
    };

    componentWillReceiveProps(props: ChooseLocationProps) {
        const { isLoggedIn, webId } = props;
        const params = new URLSearchParams(document.location.search.substr(1));
        const encodedUrl = params.get('url');

        this.setState({ oidcIssuer: 'https://solidcommunity.net/'})
        if (encodedUrl !== null) {
            const location = decodeURI(encodedUrl);
            this.setState({ location });
        }
        else if (isLoggedIn && webId) {
            const location = (new URL(webId)).origin;
            this.setState({ location });
        }
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({ location: event.target.value })
    }

    handleIDProviderChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({ oidcIssuer: event.target.value })
    }
    
    handleSubmit(event: DialogButtonClickEvent) {
        this.props.handleSubmit(event, { location: this.state.location });
    }

    handleLogin(event: DialogButtonClickEvent) {
        this.props.handleLogin(event, { oidcIssuer: this.state.oidcIssuer })
    }

    render() {
        let { location, oidcIssuer } = this.state;
        location = location ? location : '';
        const { handleClose, handleLogout, open, isLoggedIn, webId } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-choose-location" fullWidth={true} maxWidth={'sm'}>
                <form>
                    <DialogTitle id="form-dialog-choose-location">Choose the storage location</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom>
                            {!isLoggedIn ?
                                "If you want to access private resources, please choose your ID provider and login with the button below."
                                : "Logged in as " + webId + "."
                            }
                        </Typography>
                        {
                            !isLoggedIn && <TextField autoFocus fullWidth
                                margin="normal"
                                label="Solid ID provider"
                                variant="outlined"
                                onChange={this.handleIDProviderChange.bind(this)}
                                value={oidcIssuer}
                                inputProps={{ 'data-cy': 'idp' }}
                                required />
                        }
                        {!isLoggedIn ?
                            <Button variant="outlined" color="primary" onClick={this.handleLogin.bind(this)}>Login</Button>
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
                        inputProps={{ 'data-cy': 'storageLocation' }}
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

interface StateProps extends DialogStateProps {
    webId: string | null;
    isLoggedIn: boolean;
}
interface DispatchProps extends DialogDispatchProps {
    handleLogin(event: DialogButtonClickEvent, { oidcIssuer }: { oidcIssuer: string }): void;
    handleLogout(event: DialogButtonClickEvent): void;
    handleSubmit(event: DialogButtonClickEvent, { location }: { location: string }): void;
}
interface ChooseLocationProps extends StateProps, DispatchProps { }


const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.CHOOSE_LOCATION,
        webId: state.account.webId,
        isLoggedIn: state.account.loggedIn
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.CHOOSE_LOCATION));
        },
        handleLogin: (event, { oidcIssuer }) => {
            event.preventDefault();
            dispatch(solidLogin(oidcIssuer));
        },
        handleLogout: event => {
            event.preventDefault();
            dispatch(solidLogout());
        },
        handleSubmit: (event, { location }) => {
            event.preventDefault();
            if (!location)
                return dispatch(setErrorMessage("Please enter the folder which should be opened"));

            const { host, path } = getLocationObjectFromUrl(location);
            dispatch(closeDialog(DIALOGS.CHOOSE_LOCATION));
            dispatch(setHost(host));
            dispatch(clearCache());
            dispatch(enterFolder(path));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

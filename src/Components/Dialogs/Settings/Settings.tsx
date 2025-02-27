import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { MyDispatch, closeDialog, toggleWithAcl, toggleWithMeta } from '../../../Actions/Actions';
import { DialogDispatchProps, DialogStateProps } from '../dialogTypes';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core';

class FormDialog extends Component<SettingsProps> {
    state = {
        withAcl: false,
        withMeta: false,
    };

    componentWillReceiveProps(props: SettingsProps) {
        const { withAcl, withMeta } = props;
        this.setState({ withAcl, withMeta })
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({ location: event.target.value })
    }

    handleToggleWithAcl() {
        this.props.handleToggleWithAcl();
    }

    handleToggleWithMeta() {
        this.props.handleToggleWithMeta();
    }

    render() {
        let { withAcl, withMeta } = this.state;
        const { handleClose, open } = this.props;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-choose-location" fullWidth={true} maxWidth={'sm'}>
                <form>
                    <DialogTitle id="form-dialog-choose-location">Settings</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            <FormControlLabel label="Should zipping/extracting include .acl files?" control={<Switch checked={withAcl} onChange={this.handleToggleWithAcl.bind(this)} />} />
                            <FormControlLabel label="Should zipping/extracting include .meta files?" control={<Switch checked={withMeta} onChange={this.handleToggleWithMeta.bind(this)} />} />
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" type="button">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

interface StateProps extends DialogStateProps {
    withAcl: boolean;
    withMeta: boolean;
}
interface DispatchProps extends DialogDispatchProps {
    handleToggleWithAcl(): void;
    handleToggleWithMeta(): void;
}
interface SettingsProps extends StateProps, DispatchProps { }


const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.SETTINGS,
        withAcl: state.settings.withAcl,
        withMeta: state.settings.withMeta,
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => dispatch(closeDialog(DIALOGS.SETTINGS)),
        handleToggleWithAcl: () => dispatch(toggleWithAcl()),
        handleToggleWithMeta: () => dispatch(toggleWithMeta()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

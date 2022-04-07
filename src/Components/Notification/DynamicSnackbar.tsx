import React from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { MyDispatch, resetErrorMessage } from '../../Actions/Actions';
import { AppState } from '../../Reducers/reducer';

const styles = (theme: Theme) => createStyles({
  close: {
    padding: theme.spacing() / 2,
  },
});

class DynamicSnackbar extends React.Component<DynamicSnackbarProps> {
  render() {
    const { classes, errorMsg, handleClose, open, notificationDuration } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={notificationDuration}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{errorMsg}</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={handleClose} >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

interface StateProps {
  open: boolean;
  errorMsg: string;
  notificationDuration: number;
}
interface DispatchProps {
  handleClose(): void;
}
interface DynamicSnackbarProps extends StateProps, DispatchProps, WithStyles<typeof styles> {}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: !!state.errorMessage,
        errorMsg: state.errorMessage,
        notificationDuration: 60000
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
          dispatch(resetErrorMessage());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DynamicSnackbar));


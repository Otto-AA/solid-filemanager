import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const styles = (theme: Theme) => createStyles({
  progress: {
    margin: theme.spacing.unit * 10,
  },
});

function Loader(props: LoaderProps) {
    return (
        <Grid container justify="center">
            <CircularProgress className={props.classes.progress} color="secondary" />
        </Grid>
    );
}

interface LoaderProps extends WithStyles<typeof styles> {};

export default withStyles(styles)(Loader);

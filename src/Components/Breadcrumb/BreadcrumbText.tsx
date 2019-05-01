import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Button from '@material-ui/core/Button';
import './BreadcrumbText.css';

const styles = (theme: Theme) => createStyles({
  lastPath: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  paths: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    }
  }
});

class BreadcrumbText extends Component<BreadcrumbTextProps> {

    render() {
        const { classes, handleClickPath, path, rootTitle, handleGoBack, canGoBack } = this.props;

        const separator = <span>&gt;</span>;
        const rootPath = <span onClick={() => handleClickPath(-1)} data-index={0}>
            { rootTitle } { path.length ? separator : '' }
        </span>;
        const lastPath = [...path].pop() || rootTitle;

        const directories = path.map((dir, index) => {
            return <span key={index} data-index={index} onClick={(e) => handleClickPath(index)}>
                <span>{dir}</span> { path.length -1 !== index ? separator : '' }&nbsp;
            </span>
        });

        return (
            <div className="BreadcrumbText">
                <div className={classes.lastPath}>
                    <Button onClick={handleGoBack} color="inherit" type="button" style={{display: canGoBack ? 'inline-flex' : 'none'}}>
                        <KeyboardArrowLeftIcon />
                    </Button>
                    {lastPath}
                </div>
                <div className={classes.paths}>{rootPath} {directories}</div>
            </div>
        );
    }
}

interface BreadcrumbTextProps extends WithStyles<typeof styles> {
    handleClickPath(index: number): void;
    handleGoBack(): void;
    canGoBack: boolean;
    path: string[];
    rootTitle: string;

}

const mapDispatchToProps = () => ({});

const mapStateToProps = () => ({});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BreadcrumbText));

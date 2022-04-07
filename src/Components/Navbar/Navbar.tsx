import React, { ChangeEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { connect } from 'react-redux';
import { refreshItemList, moveFolderUpwardsAndRefresh, filterItems, MyDispatch } from '../../Actions/Actions';
import ThreeDotsMenu from './ThreeDotsMenu';
import BreadcrumbText from '../Breadcrumb/BreadcrumbText';
import { AppState } from '../../Reducers/reducer';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginBottom: '4.3em'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block', // was none
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(),
      width: 'auto',
      display: 'block'
    },
  },
  searchIcon: {
    width: theme.spacing() * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing() * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 100,
      '&:focus': {
        width: 200,
      },
    },
  },
});

function SearchAppBar(props: SearchAppBarProps) {
  const { classes, path, filter, moveUpwards, canGoBack, handleChange, handleRefresh } = props;
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            <BreadcrumbText 
                path={path} 
                handleClickPath={index => moveUpwards(path.length - index - 1)} 
                handleGoBack={() => moveUpwards(1)}
                canGoBack={canGoBack}
                rootTitle="Solid Filemanager"
            />
          </Typography>
          <div className={classes.grow} />

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              value={filter}
              onChange={handleChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <IconButton color="inherit" aria-label="Refresh" onClick={handleRefresh}>
            <RefreshIcon/>
          </IconButton>
          <ThreeDotsMenu />
        </Toolbar>
      </AppBar>
    </div>
  );
}

interface StateProps {
  filter: string;
  path: string[];
  canGoBack: boolean; 
}
interface DispatchProps {
  handleChange(event: ChangeEvent<HTMLInputElement>): void;
  moveUpwards(n: number): void;
  handleRefresh(): void;
}
interface SearchAppBarProps extends StateProps, DispatchProps, WithStyles<typeof styles> {

}


const mapStateToProps = (state: AppState): StateProps => {
    return {
        filter: state.items.filter,
        path: state.path,
        canGoBack: state.path.length > 0,
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleChange: (event) => {
            dispatch(filterItems(event.currentTarget.value));
        },
        moveUpwards: (n) => {
          console.log('moveUpwards', n);
          dispatch(moveFolderUpwardsAndRefresh(n));
        },
        handleRefresh: () => dispatch(refreshItemList())
    };
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SearchAppBar));

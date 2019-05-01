import React from 'react';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import CreateFolderAction from '../ContextMenu/ContextMenuActions/CreateFolderAction';
import CreateFileAction from '../ContextMenu/ContextMenuActions/CreateFileAction';
import UploadFileAction from '../ContextMenu/ContextMenuActions/UploadFileAction';
import ChooseLocationAction from '../ContextMenu/ContextMenuActions/ChooseLocationAction';

class ThreeDotsMenu extends React.Component {
  state = {
    anchorEl: null as HTMLElement|null,
  };

  handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div style={{marginLeft:'1em'}}>
        <IconButton color="inherit" 
          aria-label="More"
          aria-owns={Boolean(anchorEl) ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <CreateFolderAction handleClose={this.handleClose} />
          <CreateFileAction handleClose={this.handleClose} />
          <UploadFileAction handleClose={this.handleClose} />
          <ChooseLocationAction handleClose={this.handleClose} />
        </Menu>
      </div>
    );
  }
}


const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDotsMenu);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ContextMenu.css';
import Menu from '@material-ui/core/Menu';
import { getActionsByMultipleFiles } from '../../Api/ApiHandler.js';
import OpenAction from './ContextMenuActions/OpenAction.jsx';
import RemoveAction from './ContextMenuActions/RemoveAction.jsx';
import MoveAction from './ContextMenuActions/MoveAction.jsx';
import CopyAction from './ContextMenuActions/CopyAction.jsx';
import EditAction from './ContextMenuActions/EditAction.jsx';
import RenameAction from './ContextMenuActions/RenameAction.jsx';
import ZipAction from './ContextMenuActions/ZipAction.jsx';
import DownloadAction from './ContextMenuActions/DownloadAction.jsx';
import OpenInNewTabAction from './ContextMenuActions/OpenInNewTabAction.jsx';

class ContextMenu extends Component {

    render() {
        const { acts, visible, x, y } = this.props;

        return (
            <div>
                <Menu
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: y, left: x }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={visible}
                    onClose={() => { }}
                    PaperProps={{ style: { width: 190 } }}>
                    {acts.includes('open') && <OpenAction />}
                    {acts.includes('openInNewTab') && <OpenInNewTabAction />}
                    {acts.includes('download') && <DownloadAction />}
                    {acts.includes('edit') && <EditAction />}
                    {acts.includes('copy') && <CopyAction />}
                    {acts.includes('move') && <MoveAction />}
                    {acts.includes('rename') && <RenameAction />}
                    {acts.includes('compress') && <ZipAction />}
                    {acts.includes('remove') && <RemoveAction />}
                </Menu>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        x: state.contextMenuPosition[0] || 0,
        y: state.contextMenuPosition[1] || 0,
        visible: !!state.contextMenuVisible,
        acts: getActionsByMultipleFiles(state.selectedFiles),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);

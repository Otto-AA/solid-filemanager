import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ContextMenu.css';
import Menu from '@material-ui/core/Menu';
import OpenAction from './ContextMenuActions/OpenAction.jsx';
import RemoveAction from './ContextMenuActions/RemoveAction.jsx';
import MoveAction from './ContextMenuActions/MoveAction.jsx';
import CopyAction from './ContextMenuActions/CopyAction.jsx';
import EditAction from './ContextMenuActions/EditAction.jsx';
import RenameAction from './ContextMenuActions/RenameAction.jsx';
import ZipAction from './ContextMenuActions/ZipAction.jsx';
import ExtractAction from './ContextMenuActions/ExtractAction.jsx';
import DownloadAction from './ContextMenuActions/DownloadAction.jsx';
import OpenInNewTabAction from './ContextMenuActions/OpenInNewTabAction.jsx';
// eslint-disable-next-line no-unused-vars
import { Item, FileItem, FolderItem } from '../../Api/Item';

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
                    {acts.includes('compress') && <ZipAction />}
                    {acts.includes('extract') && <ExtractAction />}
                    {acts.includes('edit') && <EditAction />}
                    {acts.includes('copy') && <CopyAction />}
                    {acts.includes('move') && <MoveAction />}
                    {acts.includes('rename') && <RenameAction />}
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
        acts: getActionsForMultipleItems(state.selectedItems),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};


/**
 * Get available actions for multiple items
 * @param {Array<Item>} items 
 * @returns {Array<String>}
 */
const getActionsForMultipleItems = items => {
    return items.length === 1 ?
        getActionsForItem(items[0])
        : [
            'copy',
            'move',
            'remove',
            'download',
            'compress',
        ];
};

/**
 * Get available actions for an item
 * @param {Item} item
 * @returns {Array<String>}
 */
const getActionsForItem = item => {
    const commonActions = [
        'openInNewTab',
        'copy',
        'move',
        'rename',
        'remove',
        'download',
    ];
    return [
        ...commonActions,
        ...((item instanceof FileItem) ?
            getActionsForFile(item)
            : getActionsForFolder(item))
    ];
};

/**
 * Get available file specific actions
 * @param {FileItem} file
 * @returns {Array<String>}
 */
const getActionsForFile = file => {
    const actions = [];
    file.isEditable() && actions.push('edit');
    file.isExtractable() && actions.push('extract');
    (file.isImage() || file.isMedia()) && actions.push('open');

    return actions;
};

/**
 * Get available folder specific actions
 * @param {FolderItem} folder
 * @returns {Array<String>}
 */
const getActionsForFolder = folder => {
    return [
        'open',
        'compress'
    ];
};


export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
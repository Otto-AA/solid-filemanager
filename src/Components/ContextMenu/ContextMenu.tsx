import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ContextMenu.css';
import Menu from '@material-ui/core/Menu';
import OpenAction from './ContextMenuActions/OpenAction';
import RemoveAction from './ContextMenuActions/RemoveAction';
import MoveAction from './ContextMenuActions/MoveAction';
import CopyAction from './ContextMenuActions/CopyAction';
import EditAction from './ContextMenuActions/EditAction';
import RenameAction from './ContextMenuActions/RenameAction';
import ZipAction from './ContextMenuActions/ZipAction';
import ExtractAction from './ContextMenuActions/ExtractAction';
import DownloadAction from './ContextMenuActions/DownloadAction';
import OpenInNewTabAction from './ContextMenuActions/OpenInNewTabAction';
import { Item, FileItem, FolderItem } from '../../Api/Item';
import { AppState } from '../../Reducers/reducer';

class ContextMenu extends Component<ContextMenuProps> {

    render() {
        const { acts, open, x, y } = this.props;

        return (
            <div>
                <Menu
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: y, left: x }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={open}
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

interface StateProps {
    acts: string[];
    open: boolean;
    x: number;
    y: number;
}
interface ContextMenuProps extends StateProps {}


const mapStateToProps = (state: AppState): StateProps => {
    return {
        x: state.contextMenu.x,
        y: state.contextMenu.y,
        open: state.contextMenu.open,
        acts: getActionsForMultipleItems(state.items.selected),
    };
};

const mapDispatchToProps = () => ({});


/**
 * Get available actions for multiple items
 */
const getActionsForMultipleItems = (items: Item[]): string[] => {
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
 */
const getActionsForItem = (item: Item) => {
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
 */
const getActionsForFile = (file: FileItem) => {
    const actions = [];
    file.isEditable() && actions.push('edit');
    file.isExtractable() && actions.push('extract');
    (file.isImage() || file.isMedia()) && actions.push('open');

    return actions;
};

/**
 * Get available folder specific actions
 */
const getActionsForFolder = (folder: FolderItem) => {
    return [
        'open',
        'compress'
    ];
};


export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileListSublist from '../../FileList/FileListSublist/FileListSublist'; 
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { Item, FolderItem } from '../../../Api/Item';
import * as ApiHandler from '../../../Api/ApiHandler';

class FormDialog extends Component<OwnProps, OwnState> {
    private host: string;
    private path: string[];

    constructor(props: OwnProps) {
        super(props);
        const { initialPath, initialHost } = props;
        this.host = initialHost;
        this.path = initialPath;

        this.state = {
            items: [],
            isLoading: true,
            wasPreviouslyOpen: false,
        };
    }

    componentDidUpdate(prevProps: OwnProps) {
        if (prevProps.initialHost !== this.props.initialHost
            || prevProps.initialPath.join('') !== this.props.initialPath.join('')) {
            this.host = this.props.initialHost;
            this.path = this.props.initialPath;
        }
        if (this.props.open && !this.state.wasPreviouslyOpen) {
            this.setState({ wasPreviouslyOpen: true })
            this.updateItems()
        }
        if (!this.props.open && this.state.wasPreviouslyOpen) {
            this.setState({ wasPreviouslyOpen: false })
        }
    }

    handleGoBack() {
        this.path = this.path.slice(0, -1);
        this.updateItems();
    }

    handleOpenFolder(folder: FolderItem) {
        this.path = [...folder.path, folder.name];
        this.updateItems();
    }

    async updateItems() {
        this.setState({ isLoading: true });
        const items = (await ApiHandler.getItemList(this.path.join('/')))
            .filter(item => item instanceof FolderItem);

        this.setState({ isLoading: false, items });
    }

    render() {
        const { open, handleClose, handleSubmit, actionName } = this.props;
        const { items, isLoading } = this.state;
        const host = this.host;
        const path = this.path;
        const url = `${host}/${path.join('/')}`;
        const canGoBack = path.length > 0;
        
        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-move" fullWidth={true} maxWidth={'sm'}>
                <form>
                    <DialogTitle id="form-dialog-move">
                        {actionName} items to <small style={{color: 'grey'}}>{ url }</small>
                    </DialogTitle>
                    <DialogContent>
                        <FileListSublist items={items} isLoading={isLoading} handleOpenFolder={this.handleOpenFolder.bind(this)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleGoBack.bind(this)} color="primary" type="button" disabled={!canGoBack}>
                            <KeyboardArrowLeftIcon /> Go back directory
                        </Button>

                        <Button onClick={handleClose} color="primary" type="button">
                            Cancel
                        </Button>
                        <Button color="primary" onClick={(e) => { e.preventDefault(); handleSubmit({ host, path }) }} type="submit">
                            {actionName}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

interface OwnProps {
    open: boolean;
    actionName: string;
    initialHost: string;
    initialPath: string[];
    handleSubmit({ host, path }: { host: string, path: string[] }): void;
    handleClose(): void;
}

interface OwnState {
    items: Item[];
    isLoading: boolean;
    wasPreviouslyOpen: boolean;
}

export default FormDialog;

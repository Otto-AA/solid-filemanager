import React from 'react';
import { connect } from 'react-redux';
import { copyItems, closeDialog, MyDispatch } from '../../../Actions/Actions';
import { DialogStateProps } from '../dialogTypes';
import { Item } from '../../../Api/Item';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

import ChooseLocation from '../ChooseLocation/ChooseLocation';

function CopyDialog(props: CopyProps) {
    const { initialHost, initialPath, selectedItems, open, handleClose, copy } = props;

    return <ChooseLocation
        open={open}
        actionName="Copy"
        initialHost={initialHost}
        initialPath={initialPath}
        handleClose={handleClose}
        handleSubmit={(location) => copy(selectedItems, location)}
    />
}


interface StateProps extends DialogStateProps {
    initialHost: string;
    initialPath: string[];
    selectedItems: Item[];
}
interface DispatchProps {
    handleClose(): void;
    copy(selectedItems: Item[], { host, path }: { host: string, path: string[] }): void;
}
interface CopyProps extends StateProps, DispatchProps {}



const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.COPY,
        initialHost: state.account.host || '',
        initialPath: state.path,
        selectedItems: state.items.selected,
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.COPY));
        },
        copy: (selectedItems, targetLocation) => {
            dispatch(copyItems(selectedItems, targetLocation));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyDialog);

import React from 'react';
import { connect } from 'react-redux';
import { moveItems, closeDialog, MyDispatch } from '../../../Actions/Actions';
import { DialogStateProps } from '../dialogTypes';
import { Item } from '../../../Api/Item';
import { AppState } from '../../../Reducers/reducer';
import { DIALOGS } from '../../../Actions/actionTypes';

import ChooseLocation from '../ChooseLocation/ChooseLocation';

function MoveDialog(props: MoveProps) {
    const { initialHost, initialPath, selectedItems, open, handleClose, move } = props;

    return <ChooseLocation
        open={open}
        actionName="Move"
        initialHost={initialHost}
        initialPath={initialPath}
        handleClose={handleClose}
        handleSubmit={(location) => move(selectedItems, location)}
    />
}


interface StateProps extends DialogStateProps {
    initialHost: string;
    initialPath: string[];
    selectedItems: Item[];
}
interface DispatchProps {
    handleClose(): void;
    move(selectedItems: Item[], { host, path }: { host: string, path: string[] }): void;
}
interface MoveProps extends StateProps, DispatchProps {}



const mapStateToProps = (state: AppState): StateProps => {
    return {
        open: state.visibleDialogs.MOVE,
        initialHost: state.account.host || '',
        initialPath: state.path,
        selectedItems: state.items.selected,
    };
};

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        handleClose: () => {
            dispatch(closeDialog(DIALOGS.MOVE));
        },
        move: (selectedItems, targetLocation) => {
            dispatch(moveItems(selectedItems, targetLocation));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveDialog);
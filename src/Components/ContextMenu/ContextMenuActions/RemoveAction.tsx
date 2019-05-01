import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { removeItems, MyDispatch } from '../../../Actions/Actions';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { Item } from '../../../Api/Item';
import { AppState } from '../../../Reducers/reducer';

function RemoveAction(props: RemoveActionProps) {
    const { handleClick, selectedItems } = props;
    return (
        <MenuItem onClick={() => handleClick(selectedItems)}>
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Remove
            </Typography>
        </MenuItem>        
    );
}

interface RemoveActionProps {
    handleClick(selectedItems: Item[]): void;
    selectedItems: Item[];
}

const mapStateToProps = (state: AppState) => {
    return {
        selectedItems: state.items.selected
    };
};

const mapDispatchToProps = (dispatch: MyDispatch) => {
    return {
        handleClick: (selectedItems: Item[]) => {
            dispatch(removeItems(selectedItems));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveAction);

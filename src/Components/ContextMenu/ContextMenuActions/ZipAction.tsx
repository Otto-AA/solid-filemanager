import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ArchiveIcon from '@material-ui/icons/Archive';
import { zipAndUpload, MyDispatch } from '../../../Actions/Actions';
import { Item } from '../../../Api/Item';
import { AppState } from '../../../Reducers/reducer';

function ZipAction(props: ZipActionProps) {
    const { handleClick, selectedItems } = props;

    return (
        <MenuItem onClick={() => handleClick(selectedItems)}>
            <ListItemIcon>
                <ArchiveIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Zip here
            </Typography>
        </MenuItem>        
    );
}

interface ZipActionProps {
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
            dispatch(zipAndUpload(selectedItems));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZipAction);

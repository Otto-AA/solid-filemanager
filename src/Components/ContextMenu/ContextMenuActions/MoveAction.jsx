import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import { initSubList, setVisibleDialogMove } from '../../../Actions/Actions.js';

function MoveAction(props) {
    const {handleClick} = props;

    return (
        <MenuItem onClick={(e) => handleClick(e)}>
            <ListItemIcon>
                <HowToVoteIcon />
            </ListItemIcon>
            <Typography variant="inherit">
                Move
            </Typography>
        </MenuItem>        
    );
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleClick: (event) => {
            dispatch(initSubList());
            dispatch(setVisibleDialogMove(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveAction);

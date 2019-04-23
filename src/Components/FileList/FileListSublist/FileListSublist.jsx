import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileSublist from '../../File//FileSublist/FileSublist.jsx'; 
import Loader from '../../Loader/Loader.jsx'; 
import FileListEmptyMessage from '../FileListEmptyMessage';
import './FileListSublist.css'; 
import { FolderItem } from '../../../Api/Item';

class FileListSublist extends Component {
    render() {
        const { itemList, loadingSublist } = this.props;
        
        const itemComponents = itemList.map((item, key) => {
            return <FileSublist item={item} key={key} />
        });

        return <div className="FileListSublist">
            { loadingSublist ? 
                <Loader /> : 
                itemComponents.length ? itemComponents : <FileListEmptyMessage />
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    const itemList = state.itemListSublist
        .filter(item => item instanceof FolderItem)
        .filter(item => state.path.join('').trim() === state.pathSublist.join('').trim() ? 
            !state.selectedItems.some(selectedItem => selectedItem.equals(item)) : true
        );

    return {
        itemList,
        loadingSublist: state.loadingSublist,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FileListSublist);
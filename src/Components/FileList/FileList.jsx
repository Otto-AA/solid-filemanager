import React, { Component } from 'react';
import { connect } from 'react-redux';
import File from '../File/File.jsx'; 
import FileListEmptyMessage from './FileListEmptyMessage';
import Loader from '../Loader/Loader.jsx'; 
import './FileList.css';

class FileList extends Component {
    render() {
        const { itemList, loading } = this.props;
        const itemComponents = itemList.map((item, key) => {
            return <File item={item} key={key} />;
        });

        return <div className="FileList">
            { loading ? 
                <Loader /> : 
                itemComponents.length ? itemComponents : <FileListEmptyMessage />
            }
        </div>
    }
}


const mapStateToProps = (state) => {
    const filterVal = state.fileListFilter;
    const itemList = filterVal ?
        state.itemList.filter(item => filterMatch(item.getDisplayName(), filterVal))
        : state.itemList;

    return {
        itemList,
        loading: state.loading
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        handleClick: (event) => {
        }
    };
};

const filterMatch = (first, second) => {
    return first.toLocaleLowerCase().match(second.toLocaleLowerCase());
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);



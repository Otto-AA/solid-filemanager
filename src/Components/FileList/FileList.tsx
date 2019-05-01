import React, { Component } from 'react';
import { connect } from 'react-redux';
import File from '../File/File'; 
import FileListEmptyMessage from './FileListEmptyMessage';
import Loader from '../Loader/Loader'; 
import './FileList.css';
import { Item } from '../../Api/Item';
import { AppState } from '../../Reducers/reducer';

class FileList extends Component<FileListProps> {
    render() {
        const { items, isLoading } = this.props;
        const itemComponents = items.map((item, key) => {
            return <File item={item} key={key} />;
        });

        return <div className="FileList">
            { isLoading ? 
                <Loader /> : 
                itemComponents.length ? itemComponents : <FileListEmptyMessage />
            }
        </div>
    }
}

interface StateProps {
    items: Item[];
    isLoading: boolean;
}
interface FileListProps extends StateProps {};

const mapStateToProps = (state: AppState): StateProps => {
    const items = state.items.inCurFolder
        .filter(item => filterMatch(item.getDisplayName(), state.items.filter));

    return {
        items,
        isLoading: state.loading,
    };
};


const mapDispatchToProps = () => ({});

const filterMatch = (first: string, second: string) => {
    return first.toLocaleLowerCase().match(second.toLocaleLowerCase());
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);



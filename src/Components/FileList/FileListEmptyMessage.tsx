import React from 'react';
import './FileListEmptyMessage.css';

export default function FileListEmptyMessage() {
    return (
        <div className="FileListEmptyMessage">
            No files in this folder
        </div>
    );
};

// TODO: Remove this
// export default class FileListEmptyMessage extends Component {
//     render() {
//         return (
//             <div className="FileListEmptyMessage">
//                 No files in this folder
//             </div>
//         );
//     }
// }
// const mapStateToProps = (state) => {
//     return {
//     };
// };


// const mapDispatchToProps = (dispatch) => {
//     return {
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(FileListEmptyMessage);



import React from 'react';
import DialogChooseLocation from './ChooseLocation/ChooseLocation.jsx';
import DialogContent from './Content/Content.jsx';
import DialogMedia from './Media/Media.jsx';
import DialogEdit from './Edit/Edit.jsx';
import DialogCreateFolder from './CreateFolder/CreateFolder.jsx';
import DialogCreateFile from './CreateFile/CreateFile.jsx';
import DialogRename from './Rename/Rename.jsx';
import DialogMove from './Move/Move.jsx';
import DialogCopy from './Copy/Copy.jsx';
import DialogUploadFile from './UploadFile/UploadFile.jsx';

function Dialogs(props) {
    return (
        <div className="Dialogs">
            <DialogChooseLocation />
            <DialogContent />
            <DialogMedia />
            <DialogEdit />
            <DialogCreateFolder />
            <DialogCreateFile />
            <DialogMove />
            <DialogCopy />
            <DialogRename />
            <DialogUploadFile />
        </div>
    );
}

export default Dialogs;

import React, { Component, createRef } from 'react';
import Button from '@material-ui/core/Button';
import UploadFileList from './UploadFileList';

class FileUploader extends Component<FileUploadProps> {
    inputRef: React.RefObject<HTMLInputElement> = createRef();

    handleReset(event: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent): void {
        const inputElement = this.inputRef.current;
        if (inputElement) {
            inputElement.value = '';
            this.props.handleReset(event);
        }
    }

    render() {
        const { fileList, handleSelectedFiles } = this.props;
        const styles = {
            inputfile: {
                // TODO: Change this to display none as soon, as the label button works
                // display: 'none'
            }, inputreset: {
                display: (fileList && fileList.length) ? 'inline-flex' : 'none'
            }
        }

        return (
            <div>
                <label htmlFor="button-file">
                    <input style={styles.inputfile} id="button-file" ref={this.inputRef} multiple type="file" onChange={handleSelectedFiles} />
                    {/*<Button component="span" variant="contained" color="primary">
                        Select Files
                    </Button>*/}
                </label>

                <Button style={styles.inputreset} type="reset" onClick={this.handleReset.bind(this)}>
                    Clear
                </Button>

                { fileList && <UploadFileList files={fileList} /> }
            </div>
        );
    }
}

interface FileUploadProps {
    fileList: FileList|null;
    handleReset(event: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent): void;
    handleSelectedFiles(event: React.ChangeEvent<HTMLInputElement>): void;
}

export default FileUploader;

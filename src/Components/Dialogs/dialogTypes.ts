export interface DialogDispatchProps {
    handleClose(event: DialogButtonClickEvent): void;
    handleSubmit?(event: DialogButtonClickEvent, options?: Record<string, any>): void;
}

export interface DialogStateProps {
    open: boolean;
}

export type DialogButtonClickEvent<E=HTMLElement> = React.MouseEvent<E, MouseEvent>;
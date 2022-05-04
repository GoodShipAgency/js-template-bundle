export function confirmationModal() {
    return {
        isOpen: false,
        confirmCallback: null,
        defaultDialogText: {
            title: 'Confirmation',
            message: 'Are you sure you want to continue?',
            confirm: 'Continue',
            cancel: 'Cancel'
        },
        dialogText: { ...this.defaultDialogText },
        init() {
            window.addEventListener('open-confirmation-modal', this.open.bind(this));
        },
        open(event) {
            this.confirmCallback = event.detail.confirmCallback;
            if (event.detail.dialogText) {
                this.swapText(event.detail.dialogText);
            }
            this.openConfirmation();
        },
        confirm(event) {
            this.confirmCallback(event);

            this.closeConfirmation();
        },
        openConfirmation() {
            this.isOpen = true;
        },
        closeConfirmation() {
            this.isOpen = false;
            this.dialogText = { ...this.defaultDialogText };
        },
        swapText(text) {
            if (text.title) this.dialogText.title = text.title;
            if (text.message) this.dialogText.message = text.message;
            if (text.confirm) this.dialogText.confirm = text.confirm;
            if (text.cancel) this.dialogText.cancel = text.cancel;
        }
    };
}
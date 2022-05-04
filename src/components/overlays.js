import htmx from 'htmx.org';
import { dispatchWindowEvent } from '../helpers/dispatch-window-event';

const defaultLoadingIndicator = `
    <div class="flex flex-wrap h-full items-center justify-center w-full overlays-default-loading-indicator">
        <div class="flex flex-wrap justify-center">
            <div class="w-8 h-8 htmx-indicator htmx-indicator--inline loading-indicator"></div>
            <p class="text-center w-full">Loading</p>
        </div>
    </div>
`;

export function overlay(el) {
    return {
        isOpen: false,
        parentEl: null,
        init() {
            this.parentEl = el;
        },
        open() {
            if (this.isOpen) return;
            this.isOpen = true;
        },
        close() {
            if (!this.isOpen) return;
            this.isOpen = false;

            const alertContainer = this.parentEl.querySelector('.js-overlay-alert-container');
            if (alertContainer) alertContainer.remove();
        },
        toggle(event) {
            this.isOpen ? this.close() : this.open(event);
        },
    };
}

export function overlayButton(overlayType, el, loadingIndicator, confirmationDialogOptions) {
    return {
        parentEl: null,
        buttonEl: null,
        overlayType: '',
        init() {
            this.parentEl = el;
            this.buttonEl = el.querySelector(':scope > a');
            this.overlayType = overlayType;
        },
        open(event) {
            event.preventDefault();
            let path = this.buttonEl.getAttribute('href');
            let target = this.buttonEl.dataset.target;

            // Only replace content if previous request url is not the same.
            if (window.previousHtmxUrl !== path) {
                this.swapContent(path, target);
            }

            window.previousHtmxUrl = path;
            dispatchWindowEvent(`${this.overlayType}-open`);
        },
        swapContent(path, target) {
            // Remove the last content
            document.querySelector(target).innerHTML =
                loadingIndicator || defaultLoadingIndicator;

            // Make the ajax request and replace the content
            htmx.ajax('GET', path, target);
        },
        openConfirmation(event) {
            event.preventDefault();

            dispatchWindowEvent('open-confirmation-modal', {
                confirmCallback: this.open.bind(this),
                dialogText: confirmationDialogOptions,
            });
        },
    };
}

export function overlayFormResponseError(event, formId) {
    const errorContainer = document.body.querySelector(`[data-form-error-id="${formId}"]`);
    const errorContent = errorContainer.querySelector('h3');
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}`;

    errorContent.innerHTML = `An error occurred at ${date} @ ${time}. Please reload the page and try again. If this problem persists, please quote the time shown.`;
    errorContainer.classList.remove('hidden');
}

export function overlayFormClearErrors(formId) {
    const errorContainer = document.body.querySelector(`[data-form-error-id="${formId}"]`);
    if (!errorContainer.classList.contains('hidden')) {
        errorContainer.classList.add('hidden');
    }
}

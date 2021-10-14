import htmx from 'htmx.org';

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
        },
        toggle(event) {
            this.isOpen ? this.close() : this.open(event);
        },
    };
}

export function overlayButton(overlayType, el, loadingIndicator) {
    return {
        parentEl: null,
        buttonEl: null,
        confirmationOpen: false,
        overlayType: '',
        init() {
            this.parentEl = el;
            this.buttonEl = el.querySelector(':scope > a');
            this.overlayType = overlayType;
        },
        open(dispatch, event) {
            event.preventDefault();
            let path = this.buttonEl.getAttribute('href');
            let target = this.buttonEl.dataset.target;

            // Only replace content if previous request url is not the same.
            if (window.previousHtmxUrl !== path) {
                this.swapContent(path, target);
            }

            window.previousHtmxUrl = path;
            dispatch(`${this.overlayType}-open`);
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
            this.confirmationOpen = true;
        },
        closeConfirmation(event) {
            event.preventDefault();
            this.confirmationOpen = false;
        },
    };
}

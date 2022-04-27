import htmx from 'htmx.org';

export function htmxDispatch(details) {
    if (!details || !details.name) {
        return;
    }

    const elements = htmx.findAll(`[data-form-listener~="${details.name}"]`);

    elements.forEach((el) => htmx.trigger(el, 'app:form-submitted', details));
}

export function htmxSwapOn422() {
    if (!document.body.htmxSwapOn422EventAdded) {
        function beforeSwap(event) {
            if (event.detail.xhr.status === 422) {
                event.detail.shouldSwap = true;
            }
        }

        document.body.addEventListener('htmx:beforeSwap', beforeSwap);
        document.body.htmxSwapOn422EventAdded = true;
    }
}

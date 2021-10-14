export function htmxDispatch(details) {
    if (!details || !details.name) {
        return;
    }

    const elements = htmx.findAll(`[data-form-listener~="${details.name}"]`);

    elements.forEach((el) => htmx.trigger(el, 'app:form-submitted', details));
}

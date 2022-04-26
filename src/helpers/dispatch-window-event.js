export function dispatchWindowEvent(name, el, details) {
    const evt = new CustomEvent(name, {
        detail: details,
        bubbles: true,
        composed: true,
        cancelable: true,
    });

    window.dispatchEvent(evt);
}

/**
 * How to use: Place the html attribute `x-unsaved-notice` on any form element and that will automatically
 * watch for any changes within the form.
 * @param Alpine
 */
export default function (Alpine) {
    Alpine.directive('unsaved-notice', (el, values, { cleanup }) => {
        let formIsDirty = false;
        const message =
            'Are you sure you want to leave? Changes that you made may not be saved.';
        const allInputs = [
            ...el.querySelectorAll('input'),
            ...el.querySelectorAll('textarea'),
            ...el.querySelectorAll('select'),
        ];

        const unloadPage = (e) => {
            if (!formIsDirty) return;

            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        const onInputChange = () => {
            if (formIsDirty) return;

            formIsDirty = true;
            window.addEventListener('beforeunload', unloadPage, { capture: true });
        };

        const onFormSubmit = () => {
            if (!formIsDirty) return;

            formIsDirty = false;
            window.removeEventListener('beforeunload', unloadPage, { capture: true });
        };

        allInputs.forEach((field) => field.addEventListener('change', onInputChange));
        el.addEventListener('submit', onFormSubmit);

        cleanup(() => {
            allInputs.forEach((input) => input.removeEventListener('change', onInputChange));
            el.removeEventListener('submit', onFormSubmit);
            window.removeEventListener('beforeunload', unloadPage);
        });
    });
}

/**
 * Used in the slideout-button component to disable a button on a successful form submission.
 * @param Alpine
 *
 * Arguments that can be passed to directive
 * flowName - Required
 */
export const disableOnSuccess = function (Alpine) {
    Alpine.directive('disable-on-success', (el, { expression }, { evaluate, cleanup }) => {
        const { flowName } = evaluate(expression);

        window.addEventListener('slideout-form-success', disableLink);

        function disableLink(event) {
            if (event.detail.flowName !== flowName) return;

            el.setAttribute('data-disabled', 'true');
            window.removeEventListener('slideout-form-success', disableLink);
        }

        cleanup(() => {
            window.removeEventListener('slideout-form-success', disableLink);
        });
    });
};

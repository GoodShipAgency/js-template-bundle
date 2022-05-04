import { htmxDispatch } from '../components/htmx';
import { overlayFormResponseError } from '../components/overlays';
import { dispatchWindowEvent } from '../helpers/dispatch-window-event';

/**
 * Used as part of the template bundles slideout-form component.
 * @param Alpine
 *
 * Arguments that can be passed to directive
 * formId - Required
 * formName - Required
 * remainOpenOnSuccess - Whether the slideout should remain open on a successful request.
 */
export const slideoutForm = function (Alpine) {
    Alpine.directive('slideout-form', (el, { expression }, { evaluate }) => {
        const { formId, formName, flowName, remainOpenOnSuccess } = evaluate(expression);

        el.addEventListener('htmx:before-request', beforeRequest);
        el.addEventListener('htmx:after-request', afterRequest);
        el.addEventListener('htmx:response-error', responseError);
        el.addEventListener('htmx:send-error', sendError);

        function beforeRequest() {
            el.querySelector(`button#${formId}_submit`).disabled = true;
        }

        function afterRequest(event) {
            el.querySelector(`button#${formId}_submit`).disabled = false;

            if (event.detail.successful) {
                dispatchWindowEvent('slideout-form-success', {
                    formId,
                    formName,
                    flowName,
                    htmxDetails: event.detail,
                });

                htmxDispatch({ name: formName });

                if (!remainOpenOnSuccess) {
                    dispatchWindowEvent('slideout-close');
                }
            }
        }

        function responseError(event) {
            dispatchWindowEvent('slideout-form-error', {
                formId,
                formName,
                htmxDetails: event.detail,
            });

            if (event.detail.xhr.status !== 422) {
                overlayFormResponseError(event, formId);
            }
        }

        function sendError(event) {
            dispatchWindowEvent('slideout-form-error', {
                formId,
                formName,
                htmxDetails: event.detail,
            });

            if (event.detail.xhr.status !== 422) {
                overlayFormResponseError(event, formId);
            }
        }
    });
};

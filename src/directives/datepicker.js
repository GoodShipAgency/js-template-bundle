import flatpickr from 'flatpickr';
import { walkParents } from '../helpers/dom-walker';

/**
 * How to use: Place the html attribute `x-multi-select` on any form element and that will automatically
 * watch initialise a multi-select component
 * @param Alpine
 */
export const datepickerDirective = function (Alpine) {
    Alpine.directive('datepicker', (el, { expression }, { evaluate, cleanup }) => {
        const options = evaluate(expression);

        // If disabled, return early
        if (walkParents(el, null, ['js-disable-datepicker-init'])) return;

        const slideoverContainer = el
            ? walkParents(el, null, ['js-slideout-container'])
            : null;

        if (slideoverContainer) {
            options.appendTo = slideoverContainer;
        }

        // Disable weekends
        if (options.disableWeekends) {
            options.disable = [...(options.disable || []), disableWeekends];
        }

        options.onOpen = (selectedDates, dateStr, instance) => {
            if (selectedDates.length) return;

            instance.setDate(new Date());
        };

        const instance = flatpickr(el, options);

        // Disable caching on the calendar elements
        instance.calendarContainer.dataset.turboCache = 'false';

        cleanup(() => {
            if (instance) {
                instance.destroy();
            }
        });
    });
};

function disableWeekends(date) {
    // return true to disable
    return date.getDay() === 0 || date.getDay() === 6;
}

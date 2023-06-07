import flatpickr from 'flatpickr';
import { walkParents } from '../helpers/dom-walker';

/**
 * How to use: Place the html attribute `x-datepicker` on any form element/input and that will automatically
 * watch initialise a datepicker component
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

        options.altInput = options.altInput ? options.altInput : true;
        options.mode = options.mode ? 'range' : 'single';

        if (slideoverContainer) {
            options.appendTo = slideoverContainer;
        }

        // Disable days
        if (options.disableDays) {
            options.disable = [
                ...(options.disable || []),
                (date) => disableDays(date, options.disableDays),
            ];
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

        // Disable caching on the calendar elements and alt inputs
        instance.calendarContainer.dataset.turboCache = 'false';
        instance.altInput ? (instance.altInput.dataset.turboCache = 'false') : null;

        cleanup(() => {
            if (instance) {
                instance.destroy();
            }
        });
    });
};

/**
 *
 * @param {Object} date - flatpickr date object
 * @param {Array} days - array of days of the week that should be disabled [0,6] = saturday & sunday [1,2,3] = monday tuesday & wednesday.
 * @returns {*}
 */
function disableDays(date, days) {
    // return true to disable
    return days.includes(date.getDay());
}

function disableWeekends(date) {
    return disableDays(date, [0, 6]);
}

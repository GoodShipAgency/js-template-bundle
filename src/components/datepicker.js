import flatpickr from 'flatpickr';
import walkParents from '../helpers/dom-walker';

export function initialiseDatePicker(id, options = {}) {
    options.altInput = options.altInput ? options.altInput : true;
    options.mode = options.mode ? 'range' : 'single';

    let subjectNode = document.querySelector(id);
    let slideoverContainer = subjectNode
        ? walkParents(subjectNode, null, 'js-slideout-container')
        : null;

    if (slideoverContainer) {
        options.appendTo = slideoverContainer;
    }

    // Disable weekends
    if (options.disableWeekends) {
        options.disable = [...(options.disable || []), disableWeekends];
    }

    flatpickr(id, options);
}

function disableWeekends(date) {
    // return true to disable
    return date.getDay() === 0 || date.getDay() === 6;
}

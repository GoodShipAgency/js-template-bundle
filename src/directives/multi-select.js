import MultiSelect from '../vendor/multiselect-dropdown.module.js';

/**
 * How to use: Place the html attribute `x-multi-select` on any form element and that will automatically
 * watch initialise a multi-select component
 * @param Alpine
 */
export const multiSelect = function (Alpine) {
    Alpine.directive('multi-select', (el) => {
        if (!el.multiSelectInitialised) {
            new MultiSelect(el);

            // disable caching of select elements
            el.multiSelectContainer.dataset.turboCache = 'false';
        }
    });
};

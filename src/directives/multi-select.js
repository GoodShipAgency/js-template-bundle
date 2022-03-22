import MultiSelect from 'multiselect-dropdown';
/**
 * How to use: Place the html attribute `x-multi-select` on any form element and that will automatically
 * watch initialise a multi-select component
 * @param Alpine
 */
export const multiSelect = function (Alpine) {
    Alpine.directive('multi-select', (el) => {
        if (!el.parentNode.classList.contains('multi-select')) {
            new MultiSelect(el);
        }
    });
};

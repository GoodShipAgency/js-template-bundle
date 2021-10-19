import MultiSelect from 'multiselect-dropdown';

// Multi Select dropdowns, add class: "js-multi-select" to select element to use.
// For full width, add class "full-width-multi-select" to a parent element of select.

export function initialiseMultiSelect() {
    let allMultiSelectDropdowns = document.querySelectorAll('.js-multi-select');

    allMultiSelectDropdowns.forEach((selectNode) => {
        new MultiSelect(selectNode, { maxVisibleOptions: 0 });
    });
}

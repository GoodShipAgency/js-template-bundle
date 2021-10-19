import walkParents from '../helpers/dom-walker';

function checkIfNodeContains(parent, child) {
    return parent !== child && parent.contains(child);
}

export function filters() {
    return {
        tabsContainer: null,
        fieldsContainer: null,
        tabs: null,
        showFilters: false,
        openTab: null,
        url: null,
        init() {
            this.tabsContainer = this.$refs.tabsContainer;
            this.fieldsContainer = this.$refs.fieldsContainer;

            this.tabs = this.tabsContainer.children;
            this.url = new URL(location.href);

            this.setActiveTab(this.tabs[0]);
            this.showActiveField();
        },
        setActiveTab(node) {
            this.openTab = node.value;

            this.tabs.forEach((tabNode) => {
                if (tabNode.value === node.value) {
                    if (!tabNode.classList.contains('filters__tab--open')) {
                        tabNode.classList.add('filters__tab--open');
                    }
                } else {
                    tabNode.classList.remove('filters__tab--open');
                }
            });
        },
        showActiveField() {
            let formGroups = this.fieldsContainer.querySelectorAll('.form-group');
            formGroups.forEach((node) => {
                if (node.dataset.rowId === this.openTab) {
                    if (!node.classList.contains('filters__field-row--open')) {
                        node.classList.add('filters__field-row--open');
                    }
                } else {
                    node.classList.remove('filters__field-row--open');
                }
            });
        },
        filtersTabClick(e) {
            let button = e.target;

            this.setActiveTab(button);
            this.showActiveField();
        },
        closeFiltersDropout(event) {
            let targetElement = event.target;
            let allowedClickContainers = document.querySelectorAll('.js-filters-allow-clicks');
            let cancelButton = document.querySelector('.js-filters-dropout__cancel-button');
            let multiSelectOverlay = document.querySelector('.multi-select-options-overlay');

            if (targetElement === cancelButton) {
                this.showFilters = false;
                return;
            }
            let targetClass = targetElement.getAttribute('class');

            let isFlatpickr =
                (targetClass && targetClass.indexOf('flatpickr') !== -1) ||
                (targetClass && targetClass.indexOf('numInput') !== -1);
            if (isFlatpickr) {
                return;
            }

            for (let i = 0; i < allowedClickContainers.length; i++) {
                if (checkIfNodeContains(allowedClickContainers[i], targetElement)) {
                    return;
                }
            }

            if (multiSelectOverlay) {
                if (checkIfNodeContains(multiSelectOverlay, targetElement)) {
                    return;
                }
            }

            this.showFilters = false;
        },
        removeFilter(event) {
            let button = walkParents(event.target, 'button');
            let rowId = button.dataset.rowId;
            let elementsWithSameRowId = [
                ...document.querySelectorAll(`div[data-row-id="${rowId}"]`),
            ];
            if (!elementsWithSameRowId || !elementsWithSameRowId.length) return;
            let inputContainerFilter = elementsWithSameRowId.filter((el) =>
                el.classList.contains('form-group')
            );
            let inputContainer =
                inputContainerFilter && inputContainerFilter.length
                    ? inputContainerFilter[0]
                    : null;
            if (!inputContainer) return;
            let inputElements = inputContainer.querySelectorAll('input');
            let selectElements = inputContainer.querySelectorAll('select');

            if (inputElements) {
                inputElements &&
                    inputElements.forEach((node) => {
                        node.value = '';
                    });
            }

            if (selectElements) {
                selectElements.forEach((node) => {
                    let hasEmptyValue = [...node.options].some(
                        (option) => option.value === ''
                    );

                    if (hasEmptyValue) {
                        node.value = '';
                    } else {
                        // If no option with an empty value, must be a boolean type
                        node.value = '0';
                    }
                });
            }

            let submitButton = document.querySelector('.js-filters--submit-button');
            submitButton.click();
        },
        removeAllFilters() {
            let paramString = this.url.search.split('?')[1];
            let params = paramString.split(/[&;]/g);

            document.location.search =
                '?' + params.filter((p) => !p.startsWith('filter_')).join('&');
        },
    };
}

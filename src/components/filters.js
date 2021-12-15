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

            this.tabs = [...this.tabsContainer.children];
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
            const formGroups = this.fieldsContainer.querySelectorAll('.form-group');
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
            const targetElement = event.target;
            const allowedClickContainers = document.querySelectorAll(
                '.js-filters-allow-clicks'
            );
            const cancelButton = document.querySelector('.js-filters-dropout__cancel-button');
            const multiSelectOverlay = document.querySelector('.multi-select-options-overlay');

            if (targetElement === cancelButton) {
                this.showFilters = false;
                return;
            }

            const targetClass = targetElement.getAttribute('class');

            const isFlatpickr =
                (targetClass && targetClass.indexOf('flatpickr') !== -1) ||
                (targetClass && targetClass.indexOf('numInput') !== -1) ||
                walkParents(targetElement, null, 'flatpickr-calendar');

            if (isFlatpickr) {
                return;
            }

            const clickContainersLength = allowedClickContainers.length;

            for (let i = 0; i < clickContainersLength; i++) {
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
            const button = walkParents(event.target, 'button');
            const rowId = button.dataset.rowId;
            const elementsWithSameRowId = [
                ...document.querySelectorAll(`div[data-row-id="${rowId}"]`),
            ];
            if (!elementsWithSameRowId || !elementsWithSameRowId.length) return;
            const inputContainerFilter = elementsWithSameRowId.filter((el) =>
                el.classList.contains('form-group')
            );
            const inputContainer =
                inputContainerFilter && inputContainerFilter.length
                    ? inputContainerFilter[0]
                    : null;
            if (!inputContainer) return;
            const inputElements = inputContainer.querySelectorAll('input');
            const textAreaElements = inputContainer.querySelectorAll('textarea');
            const selectElements = inputContainer.querySelectorAll('select');

            if (inputElements) {
                inputElements.forEach((node) => {
                    node.value = '';
                });
            }

            if (textAreaElements) {
                textAreaElements.forEach((node) => {
                    node.value = '';
                });
            }

            if (selectElements) {
                selectElements.forEach((node) => {
                    const hasEmptyValue = [...node.options].some(
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

            const submitButton = document.querySelector('.js-filters--submit-button');
            submitButton.click();
        },
        removeAllFilters() {
            const paramString = this.url.search.split('?')[1];
            const params = paramString.split(/[&;]/g);

            document.location.search =
                '?' + params.filter((p) => !p.startsWith('filter_')).join('&');
        },
    };
}

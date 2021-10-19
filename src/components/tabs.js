export function tabs(tabs) {
    return {
        id: '',
        showDropdown: false,
        currentTabId: '',
        currentTabName: '',
        $dispatch: null,
        tabs: [],
        currentTabIndex: 0,
        init() {
            this.id = this.$el.id;
            if (tabs.length && tabs.length > 0) {
                this.tabs = tabs;
                this.setCurrentTab(tabs[0].name);
            }
        },
        closeDropdown() {
            this.showDropdown = false;
        },
        openDropdown() {
            this.showDropdown = true;
        },
        navigate(tabName) {
            if (tabName) {
                this.setCurrentTabIndex(this.findCurrentTabIndex(tabName));
                this.setCurrentTab(tabName);
                this.dispatchNavigationEvent(this.currentTabName, this.currentTabId);
                return;
            }

            this.setCurrentTabIndex(this.currentTabIndex + 1);
            this.setCurrentTab(this.tabs[this.currentTabIndex].name);
            this.dispatchNavigationEvent(this.currentTabName, this.currentTabId);
        },
        setCurrentTab(tabName) {
            let tabId = tabName.replace(' ', '').toLowerCase();
            this.currentTabName = tabName;
            this.currentTabId = tabId;
        },
        dispatchNavigationEvent(tabName, tabId) {
            let navigationEvent = new CustomEvent('tabs-navigated', {
                detail: {
                    id: this.id,
                    tab: tabName,
                    tabId: tabId,
                    isLastTab: this.tabs.length === this.currentTabIndex + 1,
                },
            });

            window.dispatchEvent(navigationEvent);
            this.closeDropdown();
        },
        findCurrentTabIndex(tabName) {
            return this.tabs.findIndex((element) => element.name === tabName);
        },
        setCurrentTabIndex(index) {
            if (this.tabs[index]) {
                this.currentTabIndex = index;
            }
        },
    };
}

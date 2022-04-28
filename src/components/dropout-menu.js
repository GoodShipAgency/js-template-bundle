import { createPopper } from '@popperjs/core';

/*
How to use
- Parent element should have both of these attributes:
    x-data="window.dropoutMenu($el)"
    @click.away="closeMenu()"

- Button to enable the dropout should have the class "js-dropout-trigger"
- Dropout menu should have the class "js-dropout-menu"

Important:
Parent element should not be be an inline element like span and should have a relative positioning property.

Also this css is required:
.popper-target .dropout__menu-container {
    display: block !important;
}
*/
const initialModifiers = [
    {
        name: 'flip',
        options: {
            fallbackPlacements: ['top-end'],
        },
    },
    {
        name: 'offset',
        options: {
            offset: [0, 8],
        },
    },
    {
        name: 'computeStyles',
        options: {
            gpuAcceleration: false,
        },
    },
];

export function dropoutMenu(parentEl) {
    return {
        dropoutButton: parentEl.querySelector('.js-dropout-trigger'),
        dropoutMenu: parentEl.querySelector('.js-dropout-menu'),
        popperInstance: null,
        popperTarget: document.querySelector('.popper-target'),
        popperEl: null,
        init() {
            if (!this.dropoutButton) {
                this.dropoutButton = parentEl.querySelector('.js-dropout-trigger');
            }
            if (!this.dropoutMenu) {
                this.dropoutMenu = parentEl.querySelector('.js-dropout-menu');
            }
            if (!this.popperTarget) {
                this.popperTarget = document.querySelector('.popper-target');
            }
        },
        initialisePopper() {
            this.createMenu();
            let popperEl = this.popperEl;

            if (this.dropoutButton && this.dropoutMenu) {
                this.popperInstance = createPopper(this.dropoutButton, popperEl, {
                    placement: 'bottom-end',
                    modifiers: initialModifiers,
                });
            }
        },
        toggleMenu() {
            if (this.dropoutMenu.hasAttribute('data-show')) {
                this.closeMenu();
            } else {
                this.initialisePopper();
                this.openMenu();
            }
        },
        createMenu() {
            let tempEl = document.createElement('div');
            tempEl.innerHTML = this.dropoutMenu.outerHTML;

            this.popperEl = this.popperTarget.appendChild(tempEl);
        },
        openMenu() {
            if (this.popperInstance) {
                this.dropoutMenu.setAttribute('data-show', '');

                // Enable the event listeners
                this.popperInstance.setOptions({
                    modifiers: [
                        ...initialModifiers,
                        { name: 'eventListeners', enabled: true },
                    ],
                });

                this.popperInstance.update();
            }
        },
        closeMenu() {
            if (this.popperInstance) {
                this.dropoutMenu.removeAttribute('data-show');
                this.popperEl.remove();
                this.popperEl = null;

                this.popperInstance.destroy();
                this.popperInstance = '';
            }
        },
    };
}

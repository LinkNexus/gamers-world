import {Controller} from '@hotwired/stimulus';
import {renderAttributes} from "@/scripts/dom";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static values = {
        multipleSteps: Boolean,
        title: String,
        id: String,
        initiallyVisible: Boolean,
        static: Boolean,
        isRendered: Boolean,
        isClosed: Boolean,
        isCloseable: {
            type: Boolean,
            default: true
        }
    }

    declare readonly multipleStepsValue: boolean;
    declare readonly titleValue: string;
    declare idValue: string;
    declare readonly initiallyVisibleValue: boolean;
    declare readonly staticValue: boolean;
    declare isRenderedValue: boolean;
    declare isClosedValue: boolean;
    declare readonly isCloseableValue: boolean;

    $modal: HTMLDivElement = document.createElement('div');
    $modalHeader: HTMLElement = document.createElement('div');

    connect() {
        if (!this.isRenderedValue) {
            this.render();
        }

        if (this.initiallyVisibleValue) {
            this.show();
        }

        document.addEventListener('modal:close', (event: Event) => {
            if ((event as CustomEvent).detail.target === this.element) {
                this.hide();
            }
        });
        document.addEventListener('modal:open', (event: Event) => {
            if ((event as CustomEvent).detail.target === this.element) {
                this.show();
            }
        });
        document.addEventListener('modal:toggle', (event: Event) => {
            if ((event as CustomEvent).detail.target === this.element) {
                this.toggle();
            }
        });
        document.addEventListener('click', this.setStatic.bind(this));
    }

    render() {
        const $modalContent = document.createElement('div');
        const $modalBody = document.createElement('div');

        const previousButton = this.multipleStepsValue ? '<button type="button" class="start-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal--multiple-steps-target="previousButton">\n' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4m0 0l6-6m-6 6l6 6"/></svg>\n' +
            '<span class="sr-only">Previous Step</span>\n' +
            '</button>' : '';

        const exitButton = this.isCloseableValue ? `
            <button data-action="modal--structure#hide" type="button" class="end-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06"/><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0"/></g></svg>
                <span class="sr-only">Close modal</span>
            </button>
        `: '';

        this.$modal.classList.add('relative', 'p-4', 'w-full', 'max-w-xl', 'max-h-full');
        $modalContent.classList.add('relative', 'bg-black', 'border', 'border-theme-primary', 'rounded-lg', 'shadow-lg');
        $modalBody.classList.add('p-4', 'md:p-5');

        $modalContent.innerHTML = `
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                ${previousButton}
                <h3 class="title text-4xl">
                    ${this.titleValue}
                </h3>
                ${exitButton}
            </div>
        `;

        $modalBody.append(...this.element.children)
        $modalContent.append($modalBody);
        this.$modal.append($modalContent);
        this.element.append(this.$modal);
        this.isRenderedValue = true;
        this.addAttributes();
    }

    addAttributes() {
        // Modal Attributes
        renderAttributes(this.element, {
            id: this.idValue + '-modal',
            tabindex: '-1',
            'aria-hidden': 'true',
            classes: ["hidden", "overflow-y-auto", "overflow-x-hidden", "fixed", "top-0", "right-0", "left-0", "z-50", "justify-center", "items-center", "w-full", "md:inset-0", "h-[calc(100%-1rem)]", "max-h-full", "modal"],
            styles: {
                background: 'rgba(0, 0, 0, 0.8)'
            }
        });

        if (this.multipleStepsValue) {
            this.element.setAttribute('data-controller', this.element.getAttribute('data-controller') + ' modal--multiple-steps');
        }
    }

    show() {
        this.element.classList.remove('hidden');
        this.element.classList.add('flex', 'justify-center', 'items-center');
    }

    hide() {
        this.element.classList.remove('flex', 'justify-center', 'items-center');
        this.element.classList.add('hidden');
    }

    toggle() {
        this.element.classList.toggle('flex');
        this.element.classList.toggle('items-center');
        this.element.classList.toggle('justify-center');
        this.element.classList.toggle('hidden');
    }

    isClosedValueChanged(currentValue: boolean) {
        if (currentValue) {
            this.hide();
        } else {
            this.show();
        }
    }

    setStatic(event: Event) {
        event.stopPropagation();

        if (event.target === this.element) {
            if (!this.staticValue) this.hide();
        }
    }

    disconnect(): void {
        // document.removeEventListener('modal:close', this.hide.bind(this));
        // document.removeEventListener('modal:open', this.show.bind(this));
        // document.removeEventListener('modal:toggle', this.toggle.bind(this));
        document.removeEventListener('click', this.setStatic.bind(this));
    }
}
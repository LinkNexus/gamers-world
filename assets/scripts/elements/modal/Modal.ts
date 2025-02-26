import { renderAttributes } from "@/scripts/dom";
import CustomElement from "../CustomElement";

export default class Modal extends CustomElement {
    protected static readonly customTag: string = 'modal-element';
    protected customProperties() {
        return {
            initiallyVisible: Boolean,
            static: Boolean,
            isRendered: Boolean,
            isClosed: Boolean,
            isCloseable: Boolean
        }
    }

    protected customActions(): string[] {
        return ['show', 'hide', 'toggle'];
    }

    declare readonly initiallyVisible: boolean;
    declare readonly static: boolean;
    declare isRendered: boolean;
    declare readonly isCloseable: boolean;

    $modal: HTMLDivElement;
    $modalHeader: HTMLDivElement;

    constructor() {
        super();
        this.$modal = document.createElement('div');
        this.$modalHeader = document.createElement('div');
    }

    connectedCallback() {
        if (!this.isRendered) {
            this.render();
        }

        if (this.initiallyVisible) {
            this.show();
        }

        this.addEventListener('click', this.setElementStatic.bind(this));
    }

    protected render() {
        const $modalContent = document.createElement('div');
        const $modalBody = document.createElement('div');

        this.$modal.classList.add('relative', 'p-4', 'w-full', 'max-w-xl', 'max-h-full');
        $modalContent.classList.add('relative', 'bg-black', 'border', 'border-theme-primary', 'rounded-lg', 'shadow-lg');
        $modalBody.classList.add('p-4', 'md:p-5');
        this.$modalHeader.classList.add('flex', 'items-center', 'justify-between', 'p-4', 'md:p-5', 'border-b', 'rounded-t', 'dark:border-gray-600');

        const exitButton = this.isCloseable ? `
            <custom-action actions="click->${this.id}:hide">
                <button type="button" class="end-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06"/><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0"/></g></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </custom-action>
        `: '';

        this.$modalHeader.innerHTML = `
            <h3 class="title text-4xl">
                ${this.title}
            </h3>
            ${exitButton}
        `;

        $modalBody.append(...this.children);
        $modalContent.append(this.$modalHeader, $modalBody);
        this.$modal.append($modalContent);
        this.append(this.$modal);
        this.isRendered = true;
        this.addAttributes();
    }  

    addAttributes() {
        renderAttributes(this, {
            tabindex: '-1',
            'aria-hidden': 'true',
            classes: ["hidden", "overflow-y-auto", "overflow-x-hidden", "fixed", "top-0", "right-0", "left-0", "z-50", "justify-center", "items-center", "w-full", "md:inset-0", "h-[calc(100%-1rem)]", "max-h-full", "modal"],
            styles: {
                background: 'rgba(0, 0, 0, 0.8)'
            }
        });
    }

    show() {
        this.classList.remove('hidden');
        this.classList.add('flex', 'justify-center', 'items-center');
    }

    hide() {
        this.classList.remove('flex', 'justify-center', 'items-center');
        this.classList.add('hidden');
    }

    toggle() {
        this.classList.toggle('flex');
        this.classList.toggle('items-center');
        this.classList.toggle('justify-center');
        this.classList.toggle('hidden');
    }

    isClosedValueChanged(currentValue: boolean) {
        if (currentValue) {
            this.hide();
        } else {
            this.show();
        }
    } 

    setElementStatic(event: MouseEvent) {
        event.stopPropagation();

        if (event.target === this) {
            if (!this.static) this.hide();
        }
    }

    disconnect(): void {
        this.removeEventListener('click', this.setElementStatic.bind(this));
    }
}
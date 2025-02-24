import { renderAttributes } from "@/scripts/dom";
import CustomElement from "../CustomElement";


export default class Clipboard extends CustomElement {
    protected static readonly customTag: string = 'clipboard-element'; 
    protected customProperties(){
        return {
            label: String,
            content: String,
            isLink: Boolean,
            isRendered: Boolean,
        }
    }

    declare label: string;
    declare content: string;
    declare isLink: boolean;
    declare isRendered: boolean;

    $button: HTMLButtonElement;
    $input: HTMLInputElement;
    $defaultIcon: HTMLSpanElement;
    $successIcon: HTMLSpanElement;

    constructor() {
        super();
        this.$button = document.createElement('button');
        this.$input = document.createElement('input');
        this.$defaultIcon = document.createElement('span');
        this.$successIcon = document.createElement('span');
    }

    connectedCallback() {
        if (this.isLink && !this.content) {
            this.content = window.location.href;
        }

        if (!this.isRendered) {
            this.render();
            this.$button.addEventListener('click', this.copyToClipboard.bind(this));
        }
    }

    render() {
        // Add attributes and HTML to the elements
        renderAttributes(this.$input, {
            id: this.id,
            type: 'text',
            class: 'w-full !rounded-none !rounded-l-md text-ellipsis',
            value: this.content,
            disabled: true,
            readOnly: true,
        });

        renderAttributes(this.$button, {
            class: 'bg-theme-secondary border border-theme-primary text-white hover:bg-theme-primary rounded-r-lg p-2 inline-flex items-center justify-center aspect-square w-fit'
        });

        this.$defaultIcon.innerHTML = this.isLink ? `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="28" stroke-dashoffset="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0"/></path></svg>
        ` : 
        `
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg>
        `;

        this.$successIcon.innerHTML = `
            <svg class="w-3.5 h-3.5 text-white" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
        `;
        this.$successIcon.classList.add('hidden');

        this.innerHTML = `
            <label for="${this.id}" class="text-sm font-medium mb-2 block">${this.label}</label>
            <div class="relative mb-4 flex"></div>
        `;

        // Append the elements to the parent element
        this.querySelector('div')?.append(this.$input, this.$button);
        this.$button.append(this.$defaultIcon, this.$successIcon);

        this.isRendered = true;
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.content).then(() => {
            this.$defaultIcon.classList.add('hidden');
            this.$successIcon.classList.remove('hidden');
            setTimeout(() => {
                this.$defaultIcon.classList.remove('hidden');
                this.$successIcon.classList.add('hidden');
            }, 2000);
        });
    }

    disconnectCallback() {
        this.$button.removeEventListener('click', this.copyToClipboard.bind(this));
    }
}
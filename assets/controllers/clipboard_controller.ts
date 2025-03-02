import {Controller} from '@hotwired/stimulus';
import {initFlowbite} from "flowbite";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static values = {
        id: String,
        label: String,
        content: {
            type: String,
            default: window.location.href
        },
        isLink: {
            type: Boolean,
            default: false
        },
        isRendered: {
            type: Boolean,
            default: false
        }
    }

    declare idValue: string;
    declare labelValue: string;
    declare contentValue: string;
    declare isLinkValue: boolean;
    declare isRenderedValue: boolean;

    connect() {
        if (!this.isRenderedValue) {
            this.render();
            window.addEventListener('load', this.attachEvents.bind(this));
        }
        initFlowbite();
    }

    render() {
        const icon = this.isLinkValue ? `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="28" stroke-dashoffset="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0"/></path></svg>
        ` : `
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg>
        `;

        this.element.innerHTML = `
            <label for="${this.idValue}"
                       class="text-sm font-medium mb-2 block">${this.labelValue}</label>
                <div class="relative mb-4 flex">
                    <input id="${this.idValue}" type="text"
                           class='w-full !rounded-none !rounded-l-md text-ellipsis'
                           value="${this.contentValue}" disabled
                           readOnly/>
                    <button data-copy-to-clipboard-target="${this.idValue}" data-tooltip-target="tooltip-${this.idValue}"
                            class="bg-theme-secondary border border-theme-primary text-white hover:bg-theme-primary rounded-r-lg p-2 inline-flex items-center justify-center aspect-square w-fit">
                        <span id="default-icon-${this.idValue}">
                            ${icon}
                        </span>
                        <span id="success-icon-${this.idValue}" class="hidden">
                            <svg class="w-3.5 h-3.5 text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>
                        </span>
                    </button>
                    <div id="tooltip-${this.idValue}" role="tooltip"
                         class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                        <span id="default-tooltip-message-${this.idValue}">Copy to clipboard</span>
                        <span id="success-tooltip-message-${this.idValue}" class="hidden">Copied!</span>
                        <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
        `;

        this.isRenderedValue = true;
    }

    attachEvents() {
        const clipboard = window.FlowbiteInstances.getInstance('CopyClipboard', this.idValue);
        const tooltip = window.FlowbiteInstances.getInstance('Tooltip', `tooltip-${this.idValue}`);

        const $defaultIcon = document.getElementById(`default-icon-${this.idValue}`);
        const $successIcon = document.getElementById(`success-icon-${this.idValue}`);

        const $defaultTooltipMessage = document.getElementById(`default-tooltip-message-${this.idValue}`);
        const $successTooltipMessage = document.getElementById(`success-tooltip-message-${this.idValue}`);

        clipboard.updateOnCopyCallback((clipboard: any) => {
            showSuccess();

            // reset to default state
            setTimeout(() => {
                resetToDefault();
            }, 2000);
        })

        const showSuccess = () => {
            $defaultIcon!.classList.add('hidden');
            $successIcon!.classList.remove('hidden');
            $defaultTooltipMessage!.classList.add('hidden');
            $successTooltipMessage!.classList.remove('hidden');
            tooltip.show();
        }

        const resetToDefault = () => {
            $defaultIcon!.classList.remove('hidden');
            $successIcon!.classList.add('hidden');
            $defaultTooltipMessage!.classList.remove('hidden');
            $successTooltipMessage!.classList.add('hidden');
            tooltip.hide();
        }
    }

    disconnect() {
        window.removeEventListener('load', this.attachEvents.bind(this));
    }
}

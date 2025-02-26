import CustomElement from "@/scripts/elements/CustomElement";
import {renderAttributes} from "@/scripts/dom";

export default class Spinner extends CustomElement {
    protected static readonly customTag: string = 'spinner-element';

    protected customProperties(): Record<string, Function | Record<string, any>> {
        return {
            attributes: Object,
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
        `;

        renderAttributes(this.querySelector('svg')!, this.attributes, {
            class: 'animate-spin text-theme-primary',
            width: '50',
            height: '50',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        });
    }
}
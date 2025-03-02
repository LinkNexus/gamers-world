import { Controller } from '@hotwired/stimulus';
import {renderAttributes} from "@/scripts/dom";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static values = {
        attributes: Object,
    }

    declare attributesValue: Record<string, string>;

    connect() {
        this.element.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
        `;

        renderAttributes(this.element.querySelector('svg')!, this.attributesValue, {
            class: 'animate-spin text-theme-primary',
            width: '50',
            height: '50',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        })
    }
}

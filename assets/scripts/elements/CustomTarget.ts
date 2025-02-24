import {renderAttributes} from "@/scripts/dom";

export default class CustomTarget extends HTMLElement {
    protected static readonly customTag: string = 'custom-target';

    connectedCallback() {
        if (this.firstElementChild) {
            renderAttributes(this.firstElementChild, {
                "data-targeted-as": this.getAttribute('targeted-as')
            }, {
                'data-targeted-as': this.firstElementChild.getAttribute('data-targeted-as') ?? ''
            });
        }
    }
}
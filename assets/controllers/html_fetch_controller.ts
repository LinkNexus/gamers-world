import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */

type Trigger = 'onload' | 'onclick' | 'onmouseover';
type Action = 'replace' | 'append' | 'prepend';

export default class extends Controller<HTMLElement> {
    static target = ['trigger', 'output'];
    static values = {
        endpoint: String,
        trigger: {
            type: String,
            default: 'onload'
        },
        action: {
            type: String,
            default: 'replace'
        }
    }

    declare endpointValue: string;
    declare triggerTarget: HTMLElement;
    declare triggerValue: Trigger;
    declare outputTarget: HTMLElement;
    declare actionValue: Action;

    async connect() {
        let element = this.triggerTarget ?? this.element;
        if (this.triggerValue === 'onload') {
            await this.fetch();
            return;
        }
        element.addEventListener(this.triggerValue.replace('on', '') as keyof ElementEventMap, this.fetch);
    }

    async fetch() {
        const response = await fetch(this.endpointValue);
        if (!response.ok) {
            alert('Something went wrong');
        }

        this.renderResponse(await response.text());
    }

    renderResponse(html: string) {
        const element = this.outputTarget ?? this.element;

        switch (this.actionValue) {
            case 'replace':
                element.innerHTML = html;
                break;
            case 'append':
                element.innerHTML += html;
                break;
            case 'prepend':
                element.innerHTML = html + element.innerHTML;
                break;
        }
    }

    disconnect() {
        let element = this.triggerTarget ?? this.element;
        element.removeEventListener(this.triggerValue.replace('on', '') as keyof ElementEventMap, this.fetch);
    }
}

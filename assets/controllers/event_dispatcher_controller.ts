import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static componentName = 'event-dispatcher';
    static values = {
        event: String,
        target: String,
    }

    declare readonly eventValue: string;
    declare readonly targetValue: string;

    dispatchEvent(): void {
        const target = document.getElementById(this.targetValue);

        if (target) {
            target.dispatchEvent(new CustomEvent(this.eventValue));
        }
    }
}

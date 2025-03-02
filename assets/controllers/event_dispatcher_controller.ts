import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class EventDispatcherController extends Controller {
    static values = {
        eventMaps: Array,
    }

    declare eventMapsValue: { event: string, target: string, trigger?: keyof DocumentEventMap }[];

    connect() {
        this.registerListeners();
    }

    registerListeners() {
        for (const eventMap of this.eventMapsValue) {
            let { event, target, trigger } = eventMap;

            this.element.addEventListener(trigger || "click", () => {
                document.querySelectorAll(target).forEach(element => {
                    this.element.dispatchEvent(new CustomEvent(event, {
                        bubbles: true,
                        detail: {
                            target: element
                        }
                    }))
                });
            })
        }
    }
}

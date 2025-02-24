import CustomElement from "./CustomElement";

export default class EventDispatcher extends CustomElement {
    protected static readonly customTag: string = 'event-dispatcher';
    protected customProperties() {
        return {
            events: Array
        }
    }
    protected defaultTriggers: ("click"|'change'|"input"|"submit")[] = ['click', 'change', 'input', 'submit'];
    protected eventsMaps = this.interpretEvents();

    //click->#test:modal.close
    declare events: Array<string>;

    constructor() {
        super();
    }

    protected interpretEvents() {
        const eventsMaps: { trigger: keyof DocumentEventMap, target: string, event: string }[] = [];
        const child = this.firstElementChild;

        for (const event of this.events) {
            const [targetTrigger, eventName] = event.split(':');
            if (targetTrigger.includes('->')) {
                const [trigger, target] = targetTrigger.split('->');
                eventsMaps.push({
                    trigger: trigger as keyof DocumentEventMap,
                    target: target,
                    event: eventName
                });
            } else if (child) {
                eventsMaps.push({
                    trigger: this.getDefaultTrigger(child),
                    target: targetTrigger,
                    event: eventName
                });
            }

        }

        return eventsMaps;
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.attachListeners();
    }

    attachListeners() {
        for (const eventMap of this.eventsMaps) {
            const targets = document.querySelectorAll(eventMap.target);
            for (const target of targets) {
                this.addEventListener(eventMap.trigger, () => {
                    this.dispatchEvent(new CustomEvent(eventMap.event, { detail: { target }, bubbles: true }));
                });
            }
        }
    }

    protected getDefaultTrigger(child: Element) {
        let trigger: keyof DocumentEventMap = 'click';

        if (child instanceof HTMLButtonElement && this.defaultTriggers.includes('click')) {
            trigger = 'click';
        } else if (child instanceof HTMLInputElement) {
            if ((child.type === 'checkbox' || child.type === 'radio') && this.defaultTriggers.includes('change')) {
                trigger = 'change';
            } else if (child.type === 'submit' && this.defaultTriggers.includes('click')) {
                trigger = 'click';
            } else if (this.defaultTriggers.includes('input')) {
                trigger = 'input';
            }
        } else if (child instanceof HTMLFormElement && this.defaultTriggers.includes('submit')) {
            trigger = 'submit';
        } else if (child instanceof HTMLSelectElement && this.defaultTriggers.includes('change')) {
            trigger = 'change';
        } else if (child instanceof HTMLTextAreaElement && this.defaultTriggers.includes('input')) {
            trigger = 'input';
        } else if (child instanceof HTMLAnchorElement && this.defaultTriggers.includes('click')) {
            trigger = 'click';
        }

        return trigger;
    }
}
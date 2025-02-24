import CustomElement from "@/scripts/elements/CustomElement";

export default class CustomAction extends CustomElement {
    static observedAttributes = ['actions'];
    protected static readonly customTag: string = 'custom-action';
    protected customProperties() {
        return {
            actions: Array,
            id: String,
        }
    }
    protected actionsMaps = this.interpretActions();

    // click->test-modal:show
    declare actions: string[];

    interpretActions() {
        const actionsMaps: { trigger: keyof DocumentEventMap, target: string, action: string }[] = [];
        const child = this.firstElementChild;

        for (const action of this.actions) {
            const [targetTrigger, actionName] = action.split(':');
            if (targetTrigger.includes('->')) {
                const [trigger, target] = targetTrigger.split('->');
                actionsMaps.push({
                    trigger: trigger as keyof DocumentEventMap,
                    target: target,
                    action: actionName
                });
            } else if (child) {
                actionsMaps.push({
                    trigger: this.getDefaultTrigger() as keyof DocumentEventMap,
                    target: targetTrigger,
                    action: actionName
                })
            } else {
                actionsMaps.push({
                    trigger: 'click',
                    target: targetTrigger,
                    action: actionName
                })
            }
        }

        return actionsMaps;
    }

    constructor() {
        super();
        this.attachListeners();
    }

    connectedCallback() {
        this.style.display = 'contents';
    }

    attachListeners() {
        for (const actionsMap of this.actionsMaps) {
            this.addEventListener(actionsMap.trigger, () => {
                this.dispatchEvent(new CustomEvent(`${actionsMap.target}.${actionsMap.action}`, { bubbles: true }));
            })
        }
    }

    actionsValueChanged(newValue: string[], oldValue: string[]) {
        this.actionsMaps = this.interpretActions();
        if (!oldValue && newValue) {
            this.attachListeners();
        }
    }

    protected getDefaultTrigger() {
        let trigger: keyof DocumentEventMap = 'click';
        const child = this.firstElementChild;

        if (child instanceof HTMLInputElement) {
            if (child.type !== 'submit') {
                if ((child.type === 'checkbox' || child.type === 'radio')) {
                    trigger = 'change';
                } else {
                    trigger = 'input';
                }
            }
        } else if (child instanceof HTMLFormElement) {
            trigger = 'submit';
        } else if (child instanceof HTMLSelectElement) {
            trigger = 'change';
        } else if (child instanceof HTMLTextAreaElement) {
            trigger = 'input';
        }

        return trigger;
    }

    childListChanged() {
        this.actionsMaps = this.interpretActions();
        this.attachListeners();
    }

}
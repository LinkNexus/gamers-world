import CustomElement from "./CustomElement";

export default class DisableButton extends CustomElement {
    protected static readonly customTag: string = 'disable-button';

    protected customTargets(): string[] {
        return ['button', 'toBeChecked', 'notEmpty'];
    }

    declare $buttonTarget: HTMLButtonElement;
    declare $toBeCheckedTargets: HTMLInputElement[];
    declare $notEmptyTargets: HTMLInputElement[];

    constructor() {
        super();
        console.log('ffff')
    }

    attachEventsToTargets() {
        // this.buttonTarget.addEventListener('click', this.checkCondition.bind(this));
        this.$buttonTarget.addEventListener('disabled-button-condition-change', this.listenConditionChange.bind(this));
        
        [...this.$toBeCheckedTargets, ...this.$notEmptyTargets]
            .forEach(
                target => target.addEventListener(
                    'input',
                    this.checkCondition.bind(this)
                )
            );
    }

    childListChanged() {
        this.attachEventsToTargets();
        console.log(this.$toBeCheckedTargets);
    }

    checkCondition() {
        this.triggerConditionEvent(
            this.$buttonTarget,
            this.areAllTargetsChecked() && this.areAllTargetsNotEmpty()
        );
    }

    triggerConditionEvent(element: HTMLElement, fulfilled: boolean) {
        element.dispatchEvent(new CustomEvent('disabled-button-condition-change', { bubbles: true, detail: { fulfilled } }));
    }

    listenConditionChange(event: Event) {
        const { fulfilled } = (event as CustomEvent).detail;
        (event.target as HTMLButtonElement).disabled = !fulfilled;
    }

    areAllTargetsChecked(): boolean{
        const targetsByName: Record<string, HTMLInputElement[]> = {};

        this.$toBeCheckedTargets.forEach(
            target => {
                if (targetsByName[target.name])
                    targetsByName[target.name].push(target);
                else targetsByName[target.name] = [target];
            }
        )

        return Object.values(targetsByName).every(
            targets => targets.some(
                target => target.checked
            )
        );
    }

    areAllTargetsNotEmpty(): boolean {
        return this.$notEmptyTargets.every(
            target => target.value !== ''
        );
    }

    doesAllToBeCheckedTargetsHaveName (): boolean {
        return this.$toBeCheckedTargets.every(target => target.name && target.name !== '');
    }

    connectedCallback() {
        if (!this.doesAllToBeCheckedTargetsHaveName())
            throw new Error('All to be checked targets must have a name attribute');

        if (!(this.$toBeCheckedTargets.length === 0 && this.$notEmptyTargets.length === 0))
            this.$buttonTarget.disabled = true;
        
        this.attachEventsToTargets();
        this.style.display = 'contents';
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.$toBeCheckedTargets.forEach(
            target => target.removeEventListener(
                'input',
                this.checkCondition.bind(this)
            )
        );

        this.$notEmptyTargets.forEach(
            target => target.removeEventListener(
                'input',
                this.checkCondition.bind(this)
            )
        );
    }
}
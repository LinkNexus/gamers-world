import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['button', 'toBeChecked', 'notEmpty'];

    declare buttonTarget: HTMLButtonElement;
    declare toBeCheckedTargets: HTMLInputElement[];
    declare notEmptyTargets: HTMLInputElement[];

    connect() {
        super.connect();

        if (!this.doesAllToBeCheckedTargetsHaveName())
            throw new Error('All to be checked targets must have a name attribute');

        if (!(this.toBeCheckedTargets.length === 0 && this.notEmptyTargets.length === 0))
            this.buttonTarget.disabled = true;

        this.attachEventsToTargets();
    }

    attachEventsToTargets() {
        this.buttonTarget.addEventListener('button-condition-change', this.listenConditionChange.bind(this));
        // this.buttonTarget.addEventListener('click', this.checkCondition.bind(this));

        [...this.toBeCheckedTargets, ...this.notEmptyTargets]
            .forEach(
                target => target.addEventListener(
                    'input',
                    this.checkCondition.bind(this)
                )
            );
    }

    checkCondition() {
        this.triggerConditionEvent(
            this.buttonTarget,
            this.areAllTargetsChecked() && this.areAllTargetsNotEmpty()
        );
    }

    triggerConditionEvent(element: HTMLElement, fulfilled: boolean) {
        element.dispatchEvent(new CustomEvent('button-condition-change', { bubbles: true, detail: { fulfilled } }));
    }

    listenConditionChange(event: Event) {
        const { fulfilled } = (event as CustomEvent).detail;
        (event.target as HTMLButtonElement).disabled = !fulfilled;
    }

    areAllTargetsChecked = (): boolean => {
        const targetsByName: Record<string, HTMLInputElement[]> = {};

        this.toBeCheckedTargets.forEach(
            target => {
                if (targetsByName[target.name])
                    targetsByName[target.name].push(target);
                else targetsByName[target.name] = [target];
            }
        )

        return Object.values(targetsByName).every(
            targets => targets.some(target => target.checked)
        );
    }

    doesAllToBeCheckedTargetsHaveName = (): boolean => {
        return this.toBeCheckedTargets.every(target => target.name && target.name !== '');
    }

    areAllTargetsNotEmpty = (): boolean => {
        return this.notEmptyTargets.every(target => target.value.trim() !== '');
    }
}

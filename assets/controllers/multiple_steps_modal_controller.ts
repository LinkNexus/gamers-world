import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['step', 'previousButton'];

    static values = {
        currentStep: {
            type: Number,
            default: 1,
        }
    }

    declare stepTargets: HTMLElement[];
    declare currentStepValue: number;
    declare previousButtonTarget: HTMLButtonElement;
    private stepTargetsOriginalStates: Record<string, string> = {};

    connect() {
        super.connect();
        this.initializeSteps();
        this.displayCurrentStep();
        this.previousButtonTarget.addEventListener('click', this.previousStep.bind(this));
    }

    initializeSteps() {
        this.stepTargets.forEach(target => {
            const dataController = target.dataset.controller,
                targetStep = target.dataset.step,
                firstChild = target.firstElementChild as HTMLElement;

            if (targetStep !== this.stepTargets.length.toString()) {
                if (!target.querySelector('[data-disable-button-target = "button"]')) {
                    this.appendButtonToElement(firstChild);
                }

                if (!dataController)
                    firstChild.dataset.controller = 'disable-button';
                else if (dataController !== 'disable-button')
                    firstChild.dataset.controller = `${dataController} disable-button`;
            }

            if (targetStep)
                this.stepTargetsOriginalStates[targetStep] = target.style.display || 'block';
        })
    }

    appendButtonToElement(element: HTMLElement) {
        const button = document.createElement('button');
        button.setAttribute('data-disable-button-target', 'button');
        button.setAttribute('type', 'button');
        button.textContent = 'Next Step';
        button.classList.add("w-full", "button-primary")
        button.setAttribute('data-action', 'multiple-steps-modal#nextStep');
        element.appendChild(button);

        return button;
    }

    previousStep() {
        if (this.currentStepValue <= 1) return;
        this.currentStepValue -= 1;
    }

    nextStep() {
        if (this.currentStepValue >= this.stepTargets.length) return;
        this.currentStepValue += 1;
    }

    displayCurrentStep() {
        this.stepTargets.forEach(target => {
            if (target.dataset.step === this.currentStepValue.toString())
                target.style.display = this.stepTargetsOriginalStates[this.currentStepValue.toString()];
            else target.style.display = 'none';
        })

        this.previousButtonTarget.style.display = this.currentStepValue === 1 ? 'none' : 'inline-flex';
    }

    currentStepValueChanged(value: number, previousValue: number) {
        if (previousValue === undefined) return;
        this.displayCurrentStep();
    }
}

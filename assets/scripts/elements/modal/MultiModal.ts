import Modal from "./Modal";
import {Component, getComponent} from "@symfony/ux-live-component";

export default class MultiModal extends Modal {
    protected static readonly customTag: string = 'multi-modal';

    protected customTargets(): string[] {
        return [
            ...super.customTargets(),
            'step',
            'dynamicForm',
        ];
    }

    protected customActions(): string[] {
        return [
            ...super.customActions(),
            'previousStep',
            'nextStep',
        ]
    }

    private currentStep: number = 1;
    private stepsStates: Record<number, string> = {};
    static: boolean = true;
    private readonly $previousButton: HTMLElement;
    private formComponent: Component|null = null;

    declare $stepTargets: HTMLElement[];
    declare $dynamicFormTarget: HTMLFormElement;

    constructor() {
        super();
        this.$previousButton = document.createElement('custom-action');
    }

    async connectedCallback() {
        super.connectedCallback();
        this.initializeSteps();
        this.displayCurrentStep();
        if (this.$dynamicFormTarget) {
            this.formComponent = await getComponent(this.$dynamicFormTarget);
        }
        this.formComponent?.on('render:finished', () => {
            this.displayCurrentStep();
            // this.appendButtonsToSteps();
        })
    }

    protected render(): void {
        super.render(); 
        this.$previousButton.setAttribute('actions', `${this.id}:previousStep`);
        this.$previousButton.innerHTML = `
            <button type="button" class="start-2.5 text-theme-primary bg-transparent hover:bg-theme-primary hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4m0 0l6-6m-6 6l6 6"/></svg>
                <span class="sr-only">Previous Step</span>
            </button>
        `;
        this.$modalHeader.prepend(this.$previousButton);
    }

    private initializeSteps(): void {
        this.$stepTargets.forEach(($step, index, $steps) => {
            this.stepsStates[index] = getComputedStyle($step).display;
        });
        // this.appendButtonsToSteps();
    }

    // private appendButtonsToSteps(): void {
    //     this.$stepTargets.forEach(($step, index) => {
    //         if (index !== this.$stepTargets.length - 1 && !$step.querySelector(`custom-action[actions="${this.id}:nextStep"]`)) {
    //             const $customActionButton = document.createElement('custom-action');
    //             $customActionButton.setAttribute('actions', `${this.id}:nextStep`);
    //             $customActionButton.innerHTML = `
    //                 <button data-target="${$step.id}:button" type="button" class="w-full button-primary">
    //                     Next Step
    //                 </button>
    //             `;
    //             $step.appendChild($customActionButton);
    //         }
    //     })
    // }


    displayCurrentStep() {
        this.$stepTargets.forEach(($step, index) => {
            if (index + 1 === this.currentStep) {
                $step.style.display = this.stepsStates[index];
            } else {
                $step.style.display = 'none';
            }
        })

        this.$previousButton.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
    }

    previousStep() {
        if (this.currentStep <= 1) return;
        this.currentStep -= 1;
        this.displayCurrentStep();
    }

    nextStep() {
        if (this.currentStep >= this.$stepTargets.length) return;
        this.currentStep += 1;
        this.displayCurrentStep();
    }
};
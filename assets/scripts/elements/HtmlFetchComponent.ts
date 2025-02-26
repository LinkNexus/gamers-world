import CustomElement from "@/scripts/elements/CustomElement";
import {useDelay} from "@/react/utils";

export default class HtmlFetchComponent extends CustomElement {
    static observedAttributes = ["loading"];
    static customTag: string = 'html-fetch';
    protected customTargets(): string[] {
        return [
            'output'
        ];
    }

    protected customActions(): string[] {
        return [
            "fetch"
        ]
    }

    protected customProperties(): Record<string, Function | Record<string, any>> {
        return {
            endpoint: String,
            action: String,
            fetchInitially: Boolean,
            loading: Boolean,
        };
    }

    declare endpoint: string;
    declare action: string;
    declare loading: boolean;
    declare fetchInitially: boolean;
    declare $outputTarget: HTMLElement;

    private response: string|null = null;

    async connectedCallback() {
        this.style.display = 'contents';
        if (!this.action) this.action = "replace";

        if (this.fetchInitially) {
            await this.fetch();
        }
    }

    async fetch() {
        this.loading = true;
        await useDelay(5000);
        const response = await fetch(this.endpoint);
        if (!response.ok) {
            alert('Something went wrong');
        }

        this.response = await response.text();
        this.loading = false;
    }

    renderText(text: string) {
        const element = this.$outputTarget ?? this;

        switch (this.action) {
            case 'replace':
                element.innerHTML = text;
                break;
            case 'append':
                element.innerHTML += text;
                break;
            case 'prepend':
                element.innerHTML = text + element.innerHTML;
                break;
        }
    }

    loadingValueChanged() {
        this.renderText(this.response ?? "<spinner-element></spinner-element>");
    }

}
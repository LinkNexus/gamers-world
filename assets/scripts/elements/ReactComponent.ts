import CustomElement from "@/scripts/elements/CustomElement";
import ReactDOM from "react-dom/client";
import React from "react";

export default class ReactComponent extends CustomElement {
    protected static readonly customTag: string = 'react-component';
    protected customProperties() {
        return {
            component: String,
            props: Object,
        }
    }

    declare component: string;
    declare props: Record<string, any>
    declare componentModule: any;
    declare componentsContext: __WebpackModuleApi.RequireContext;

    constructor() {
        super();
        this.findController();
    }

    findController() {
        this.componentsContext = require.context('../../react', true, /Controller\.([jt])sx?$/);
        this.componentsContext.keys().forEach((key) => {
            for (const ext of ['jsx', 'tsx']) {
                if (key.includes(this.component) && key.endsWith(ext)) {
                    this.componentModule = this.componentsContext(key);
                }
            }
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.componentModule) {
            console.error(`No component found for ${this.component}`);
            console.log('Possible values:' + this.componentsContext.keys().filter((key) => key.includes(this.component)).join(', '));
            return;
        }
        ReactDOM.createRoot(this).render(React.createElement(this.componentModule.default, this.props));
    }
}
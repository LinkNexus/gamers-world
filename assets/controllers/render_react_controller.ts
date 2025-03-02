import { Controller } from '@hotwired/stimulus';
import ReactDOM from 'react-dom/client';
import React from "react";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static values = {
        component: String,
        props: Object
    }

    declare propsValue: Object;
    declare componentValue: string;
    declare componentModule: any;
    declare componentsContext: __WebpackModuleApi.RequireContext;

    initialize() {
        super.initialize();
        this.findController();
    }

    connect() {
        super.connect();
        this.render();
    }

    findController() {
        this.componentsContext = require.context('../', true, /Controller\.([jt])sx?$/);
        this.componentsContext.keys().forEach((key) => {
            for (const ext of ['jsx', 'tsx']) {
                if (key.includes(this.componentValue) && key.endsWith(ext)) {
                    this.componentModule = this.componentsContext(key);
                }
            }
        });
    }

    render() {
        if (!this.componentModule) {
            console.error(`No component found for ${this.componentValue}`);
            console.log('Possible values:' + this.componentsContext.keys().filter((key) => key.includes(this.componentValue)).join(', '));
            return;
        }
        ReactDOM.createRoot(this.element).render(React.createElement(this.componentModule.default, this.propsValue));
    }
}

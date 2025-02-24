export default class CustomElementsDefiner {
    private controllersModules: Promise<any>[] = [];
    private static instance: CustomElementsDefiner;

    public static instantiate(): CustomElementsDefiner {
        if (!this.instance) {
            this.instance = new CustomElementsDefiner();
        }

        return this.instance;
    }

    private constructor() {
        const context = import.meta.webpackContext('./', {
            regExp: /\.[jt]sx?$/,
            exclude: /CustomElement\.ts$|index\.ts$/,
            mode: 'lazy'
        });

        context.keys().forEach((key) => {
            this.controllersModules.push(context(key));
        });
    } 

    public async registerElements() {
        for (const module of await Promise.all(this.controllersModules)) {
            const componentName = module.default.customTag;

            if (componentName) {
                customElements.define(componentName, module.default);
            }
        }
    }
}
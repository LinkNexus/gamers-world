export function renderAttributes (
    element: Element,
    attributes: Record<string, any>,
    defaults: Record<string, any> = {}
) {
    Object.entries(attributes).forEach(
        function ([key, value]) {

            if (key === 'styles') {
                let styles = value;
                if (defaults.styles) {
                    styles = {...defaults.styles, ...value};
                }
                renderStyles(element as HTMLElement, styles);
                delete defaults.style;
                return;
            }

            if (key === 'classes') {
                let classes = value;
                if (defaults.classes) {
                    classes = [ ...defaults.classes, ...value ];
                }
                element.classList.add(...classes);
                delete defaults[key];
            }

            const cumulativeAttributes = [
                'class',
                'id',
                'data-controller'
            ];

            if (cumulativeAttributes.includes(key) && defaults[key]) {
                value = `${defaults[key]} ${value}`;
                delete defaults[key];
            }
            element.setAttribute(key, value);
        }
    )

    Object.entries(defaults).forEach(
        function ([key, value]) {
            element.setAttribute(key, value);
        }
    )
}

export function renderStyles (element: HTMLElement, styles: Record<string, string>) {
    Object.entries(styles).forEach(
        function ([key, value]) {
            element.style.setProperty(key, value);
        }
    )
}
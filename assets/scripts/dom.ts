export function renderAttributes (
    element: Element,
    attributes: Record<string, string>,
    defaults: Record<string, string>
) {
    Object.entries(attributes).forEach(
        function ([key, value]) {
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
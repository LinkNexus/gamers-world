import {Children, cloneElement, HTMLAttributes, isValidElement, PropsWithChildren} from "react";

export default function ({ children, attributes }: PropsWithChildren<{ attributes: HTMLAttributes<HTMLElement> & Record<string, string> }>) {
    return Children.map(children, function (child) {
        if (isValidElement(child)) {
            return cloneElement(child, {
                ...attributes,
                "data-controller": `${(child.props as any)["data-controller"] || ""} ${attributes["data-controller"] || ""}`
            } as HTMLAttributes<HTMLElement>);
        }

        return child;
    })
}
import { ComponentProps } from "react";

export default function ({ ...props }: ComponentProps<'svg'>) {
    return (
        <div data-controller="spinner" data-spinner-attributes-value={JSON.stringify(props)}>
        </div>
    );
}
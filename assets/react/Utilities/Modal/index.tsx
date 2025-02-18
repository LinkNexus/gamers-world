interface ModalProps {
    title: string;
    children: React.ReactNode;
    id: string;
    initiallyVisible?: boolean;
    isStatic?: boolean;
    multipleSteps?: boolean;
}

export default function ({ title, children, id, isStatic = false, initiallyVisible = false, multipleSteps = false }: ModalProps) {
    return (
        <div
            data-controller="modals--render"
            data-modals--render-id-value={id}
            data-modals--render-initially-visible-value={`${initiallyVisible}`}
            data-modals--render-title-value={title}
            data-modals--render-static-value={`${isStatic}`}
            data-modals--render-multiple-steps-value={`${multipleSteps}`}
        >
            {children}
        </div>
    )
}
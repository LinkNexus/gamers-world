import {ComponentProps, memo, PropsWithChildren, ReactNode} from "react";

interface Props {
    playerSide: ReactNode;
    opponentSide: ReactNode;
}

export default memo(
    function ({playerSide, opponentSide}: Props) {
        return (
            <div className='flex flex-col min-h-screen h-screen w-full lg:flex-row'>
                <QueueSide className='border-b-2 border-theme-primary lg:border-b-0 lg:border-r-2'>
                    {playerSide}
                </QueueSide>

                <QueueSide>
                    {opponentSide}
                </QueueSide>
            </div>
        );
    }
);

function QueueSide ({ children, className, ...props }: PropsWithChildren<ComponentProps<'div'>>) {
    return (
        <div
            className={'w-full h-1/2 flex flex-col items-center justify-center flex-wrap lg:w-1/2 lg:h-full ' + className}
            {...props}
        >
            {children}
        </div>
    );
}
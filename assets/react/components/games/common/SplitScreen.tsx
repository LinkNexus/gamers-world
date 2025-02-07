import {memo, ReactNode} from "react";

interface Props {
    playerSide: ReactNode;
    opponentSide: ReactNode;
}

const SplitScreen = memo(
    function ({playerSide, opponentSide}: Props) {
        return (
            <div className='flex flex-col min-h-screen h-screen w-full lg:flex-row'>
                <div className='queue-side border-b-2 border-theme-primary lg:border-b-0 lg:border-r-2'>
                    {playerSide}
                </div>

                <div className='queue-side'>
                    {opponentSide}
                </div>
            </div>
        );
    }
)

export default SplitScreen;
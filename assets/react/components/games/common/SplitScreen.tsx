import React, {ReactElement} from "react";

interface Props {
    playerSide?: ReactElement;
    opponentSide?: ReactElement;
    structure?: Record<'playerSide'|'opponentSide', ReactElement>;
}

export default function ({ playerSide, opponentSide, structure }: Props) {
    playerSide = playerSide || structure?.playerSide;
    opponentSide = opponentSide || structure?.opponentSide;

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
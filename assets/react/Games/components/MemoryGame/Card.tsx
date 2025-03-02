import {useEffect, useRef, useState} from "react";
import {useDelay} from "@/react/utils";

interface Props {
    value: string;
    state: "hidden" | "flipped";
    onClick: () => void;
}

export default function ({ value, state, onClick }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = state === "flipped";

    return (
        <div
            ref={ref}
            className={
                'md:w-40 shadow-md cursor-pointer' + (isVisible ? ' flip' : '')
            }
            onClick={onClick}
        >
            <img
                className='w-full h-full rounded-md'
                src={`/images/memory-game/${isVisible ? value : 'hidden'}.webp`}
                alt={isVisible ? value : 'hidden-image'}
            />
        </div>
    );
}
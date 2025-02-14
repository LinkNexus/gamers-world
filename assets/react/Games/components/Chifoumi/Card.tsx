import type {ChifoumiChoice} from "@/react/Games/types/enums";

interface Props {
    type: ChifoumiChoice;
    onClick?: (value: ChifoumiChoice) => void;
}

export default function ({ type, onClick }: Props) {
    return (
        <div
            onClick={ function (this: HTMLDivElement) {
                if (onClick)
                    onClick(type)
            }}
            className='bg-theme-secondary w-fit border-2 border-theme-primary shadow-md cursor-pointer rounded-xl p-1 flex flex-col items-center justify-center shadow-lg hover:bg-theme-primary hover:transition-all'>
            <img className='w-40' src={`/images/chifoumi/${type.toLowerCase()}.png`} alt={type} />
            <span className='text-white text-xl font-semibold'>{type}</span>
        </div>
    )
}
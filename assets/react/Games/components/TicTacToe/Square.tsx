import { TicTacToeSymbol } from "@/react/Games/types/enums";

interface Props {
    onClick: () => void;
    value: TicTacToeSymbol|null;
    highlighted: boolean;
}

export default function ({ onClick, value, highlighted }: Props) {
    return (
        <div 
            className={(highlighted ? "bg-theme-primary" : "bg-theme-secondary hover:bg-theme-primary" ) + " cursor-pointer text-white text-6xl font-bold flex content-center justify-center flex-wrap clickable shadow-theme-secondary"}
            onClick={onClick}
        >
            {value}
        </div>
    );
}
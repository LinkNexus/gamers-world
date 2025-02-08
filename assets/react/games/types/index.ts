import type {GameType, PlayerStatus} from "@/react/components/games/types/enums";

export interface Player {
    identifier: string;
    image: string;
    username: string;
    status: PlayerStatus;
}

export interface GameProps {
    urls: Record<string, string>;
    gameType: GameType;
}
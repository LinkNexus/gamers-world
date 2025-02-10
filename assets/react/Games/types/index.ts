import type {GameType, PlayerStatus} from "@/react/Games/types/enums";

export interface Player {
    identifier: string;
    image: string;
    username: string;
    status: PlayerStatus;
    previousStatus: PlayerStatus;
}
import type {PlayerStatus} from "@/react/Games/types/enums";

export interface Player {
    identifier: string;
    image: string;
    username: string|null;
    status: PlayerStatus;
    previousStatus: PlayerStatus;
}
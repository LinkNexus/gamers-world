import {PlayerStatus} from "@/react/types/enums";

export interface Player {
    identifier: string;
    image: string;
    username: string;
    status: PlayerStatus;
}
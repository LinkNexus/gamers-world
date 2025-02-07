import {PlayerStatus} from "@/react/enums";

export interface Player {
    identifier: string;
    image: string;
    username: string;
    status: PlayerStatus;
}
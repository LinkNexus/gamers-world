import {Player} from "@/react/Games/types";
import {GameDifficulty, GameName, GameType} from "@/react/Games/types/enums";

declare global {
    interface Window {
        game: {
            user: Omit<Omit<Player, 'status'>, 'previousStatus'>,
            initiator: string,
            urls: Record<"join"|"synchronization"|"isReady"|"disconnect"|"play", 'string'>,
            type: GameType,
            name: GameName,
            duration: number|null,
            difficulty: GameDifficulty|null,
            identifier: string,
        },
        FlowbiteInstances: any;
    }
}
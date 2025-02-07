import { GameType } from "@/react/types/enums";
import WaitingQueue from "../common/WaitingQueue";
import useGameStore from "@/react/stores/game-store";

interface Props {
    urls: Record<string, string>;
    gameType: GameType;
}

export default function ({ urls, gameType }: Props) {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();

    return (
        <WaitingQueue
            joinUrl={urls.join}
            synchronizationUrl={urls.synchronization}
            isReadyUrl={urls.isReady}
        />
    )
}
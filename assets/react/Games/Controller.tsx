import WaitingQueue from "@/react/Games/components/common/waiting-queue/WaitingQueue";
import useGameStore from "@/react/Games/store";
import {GameName, GameType, PlayerStatus} from "@/react/Games/types/enums";
import TicTacToe from "@/react/Games/components/tic-tac-toe/TicTacToe";
import Chifoumi from "@/react/Games/components/chifoumi/Chifoumi";

interface Props {
    gameType: GameType;
    gameName: GameName;
    urls: Record<string, string>;
    turnTime: number;
}

/**
 * Main Game component that will render the game based on the game type and name
 */
export default function ({ gameName, gameType, urls, turnTime = 180 }: Props) {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();

    // Render the game based on the game name
    if (user.status === PlayerStatus.READY && opponent?.status === PlayerStatus.READY) {
        switch (gameName) {
            case GameName.TIC_TAC_TOE:
                return <TicTacToe gameType={gameType} urls={urls} />;
            case GameName.CHIFOUMI:
                return <Chifoumi gameType={gameType} urls={urls} />;
        }
    }

    if (user.status === PlayerStatus.DISCONNECTED) {
        return (
            <div>
                You was kicked out of the game
            </div>
        );
    }

    return (
        <WaitingQueue
            joinUrl={urls.join}
            synchronizationUrl={urls.synchronization}
            isReadyUrl={urls.isReady}
            disconnectUrl={urls.disconnect}
        />
    );

}
import WaitingQueue from "@/react/Games/components/common/WaitingQueue";
import useGameStore from "@/react/Games/store";
import {GameName, PlayerStatus} from "@/react/Games/types/enums";
import TicTacToe from "@/react/Games/components/TicTacToe";
import Chifoumi from "@/react/Games/components/Chifoumi";

/**
 * Main Game component that will render the game based on the game type and name
 */
export default function () {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const name = useGameStore.use.name();

    const playingStates = [
        PlayerStatus.READY,
        PlayerStatus.PLAYING,
        PlayerStatus.WON,
        PlayerStatus.LOST,
        PlayerStatus.DREW
    ];

    // Render the game based on the game name
    if (
        (
            opponent &&
            playingStates.includes(user.status) &&
            playingStates.includes(opponent.status)
        ) || user.previousStatus === PlayerStatus.PLAYING
    ) {
        switch (name) {
            case GameName.TIC_TAC_TOE:
                return <TicTacToe />;
            case GameName.CHIFOUMI:
                return <Chifoumi />;
        }
    }


    return (
        <WaitingQueue />
    );
}
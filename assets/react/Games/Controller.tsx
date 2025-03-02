import WaitingQueue from "@/react/Games/components/common/WaitingQueue";
import useGameStore from "@/react/Games/store";
import {GameName, GameType, PlayerStatus} from "@/react/Games/types/enums";
import TicTacToe from "@/react/Games/components/TicTacToe";
import Chifoumi from "@/react/Games/components/Chifoumi";
import MemoryGame from "@/react/Games/components/MemoryGame";
import {useEffect} from "react";
import {useFetch} from "@/react/utils";

/**
 * Main Game component that will render the game based on the game type and name
 */
export default function () {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const name = useGameStore.use.name();
    const gameType = useGameStore.use.type();
    const gameId = useGameStore.use.identifier();
    const initiator = useGameStore.use.initiator();

    const celebrate = useGameStore.getState().celebrate;
    const { load: setWinnerRequest } = useFetch(`/games/session/${gameId}/winner`);

    const playingStates = [
        PlayerStatus.READY,
        PlayerStatus.PLAYING,
        PlayerStatus.WON,
        PlayerStatus.LOST,
        PlayerStatus.DREW
    ];

    useEffect(function () {
        if (user.status === PlayerStatus.WON) {
            setWinnerRequest({
                identifier: user.identifier,
            })
            celebrate();
        }

        if (user.status === PlayerStatus.DREW && user.identifier === initiator) {
            setWinnerRequest({});
        }
    }, [user.status]);

    if (gameType === GameType.SOLO) {
        return <MemoryGame />;
    }

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
            case GameName.MEMORY_GAME:
                return <MemoryGame />;
        }
    }

    return (
        <WaitingQueue />
    );
}
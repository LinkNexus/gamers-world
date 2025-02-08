import React from "react";
import WaitingQueue from "@/react/components/games/common/WaitingQueue";
import useGameStore from "@/react/stores/game-store";
import {GameName, GameType, PlayerStatus} from "@/react/types/enums";
import Spinner from "@/react/components/utilities/Spinner";
import {Player} from "@/react/types";
import TicTacToe from "../components/games/tic-tac-toe/TicTacToe";
import Chifoumi from "../components/games/chifoumi/Chifoumi";

interface Props {
    userJson: string;
    gameType: GameType;
    gameName: GameName;
    urls: Record<string, string>,
}

/**
 * Main Game component that will render the game based on the game type and name
 */
export default function ({ userJson, gameName, gameType, urls }: Props) {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();

    // Set the current connected user
    useGameStore.getState().setUser({ ...JSON.parse(userJson), status: PlayerStatus.WAITING } as Player);

    // Render the game based on the game name
    if (user.status === PlayerStatus.READY && opponent?.status === PlayerStatus.READY) {
        switch (gameName) {
            case GameName.TIC_TAC_TOE:
                return <TicTacToe gameType={gameType} urls={urls} />;
            case GameName.CHIFOUMI:
                return <Chifoumi gameType={gameType} urls={urls} />
        }
    }

    return (
        <WaitingQueue
            joinUrl={urls.join}
            synchronizationUrl={urls.synchronization}
            isReadyUrl={urls.isReady}
        /> 
    )
}
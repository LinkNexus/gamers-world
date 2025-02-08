import React from "react";
import WaitingQueue from "@/react/games/components/common/WaitingQueue";
import useGameStore from "@/react/games/store";
import {GameName, GameType, PlayerStatus} from "@/react/games/types/enums";
import {Player} from "assets/react/games/types";
import TicTacToe from "@/react/games/components/tic-tac-toe/TicTacToe";
import Chifoumi from "@/react/games/components/chifoumi/Chifoumi";

interface Props {
    userJson: string;
    gameType: GameType;
    gameName: GameName;
    urls: Record<string, string>,
    turnTime: number
}

/**
 * Main Game component that will render the game based on the game type and name
 */
export default function ({ userJson, gameName, gameType, urls, turnTime = 180 }: Props) {
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
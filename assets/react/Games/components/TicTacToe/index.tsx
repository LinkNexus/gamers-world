import Board from "./Board";
import {useEffect} from "react";
import useGameStore from "@/react/Games/store";

export default function () {
    const startGame = useGameStore.getState().ticTacToeActions.startGame;
    useEffect(() => {
        startGame();
    }, []);

    return (
        <div className="w-full h-screen flex flex-wrap flex-col content-center justify-center px-5">
            <Board />
        </div>
    );
}
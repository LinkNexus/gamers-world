import Board from "@/react/Games/components/MemoryGame/Board";
import {useEffect} from "react";
import useGameStore from "@/react/Games/store";

export default function () {
    const setCards = useGameStore.getState().memoryGameActions.setCards;
    const startTimer = useGameStore.getState().timerActions.start;
    const startGame = useGameStore.getState().memoryGameActions.startGame;

    useEffect(function () {
        startGame();
        setCards();
        startTimer();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-wrap flex-col content-center justify-center px-5">
            <Board />
        </div>
    );
}
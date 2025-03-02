import useGameStore from "@/react/Games/store";
import Square from "./Square"
import {GameEvent, GameType, PlayerStatus, TicTacToeSymbol} from "@/react/Games/types/enums";
import {useGameEventSource, useGameFetch} from "@/react/Games/utils";
import {Player} from "@/react/Games/types";
import {useEffect, useState} from "react";
import Timer from "@/react/Games/components/common/Timer";
import {useDelay} from "@/react/utils";

export default function () {
    // States from the store
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const userSymbol = useGameStore.use.ticTacToe().user;
    const squares = useGameStore.use.ticTacToe().squares;
    const currentPlayer = useGameStore.use.ticTacToe().currentPlayer;
    const urls = useGameStore.use.urls();
    const gameType = useGameStore.use.type();
    const gameName = useGameStore.use.name();

    // Store actions
    const stopTimer = useGameStore.getState().timerActions.stop;
    const startTimer = useGameStore.getState().timerActions.start;
    const toggleCurrentPlayer = useGameStore.getState().ticTacToeActions.toggleCurrentPlayer;
    const setSquares = useGameStore.getState().ticTacToeActions.setSquares;
    const declareWinner = useGameStore.getState().ticTacToeActions.declareWinner;
    const changeUserStatus = useGameStore.getState().changeUserStatus;
    const changeOpponentStatus = useGameStore.getState().changeOpponentStatus;

    // Local and derived states
    const [winningMoves, setWinningMoves] = useState<number[]>([]);
    const canPlay = currentPlayer === userSymbol;
    const gameEnd = winningMoves.length !== 0 || user.status === PlayerStatus.DISCONNECTED || opponent!.status === PlayerStatus.DISCONNECTED || user.status === PlayerStatus.DREW;
    const againstComputer = gameType === GameType.COMPUTER;

    const { dispatchGameEvent } = useGameFetch();

    function getWinningMoves (squares: TicTacToeSymbol[]): number[]|null {
        const winningMoves = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningMoves.length; i++) {
            const [a, b, c] = winningMoves[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return [a, b, c];
            }
        }

        if (squares.every((square) => square !== null)) return [];

        return null;
    }

    async function onSquareClick(index: number) {
        if (gameEnd) return;
        if (!canPlay) return;
        if (squares[index] !== null) return;

        const nextSquares = squares.slice();
        nextSquares[index] = currentPlayer;
        setSquares(nextSquares);
        const winningMoves = getWinningMoves(nextSquares);
        if (winningMoves) {
            declareWinner(winningMoves, currentPlayer);
            setWinningMoves(winningMoves);
        }

        toggleCurrentPlayer();

        await dispatchGameEvent({
            event: GameEvent.PLAY,
            payload: {
                justPlayed: userSymbol,
                squares: nextSquares,
                againstComputer,
                gameName
            }
        })
    }

    useGameEventSource<{
        justPlayed: TicTacToeSymbol,
        squares: TicTacToeSymbol[]
    }>(urls.play, async function ({ event, payload }) {
        const { justPlayed, squares } = payload;

        if (event === GameEvent.PLAY && justPlayed !== userSymbol) {
            if (againstComputer) {
                if (gameEnd) return;
                await useDelay(1000);
            }

            setSquares(squares);
            const winningMoves = getWinningMoves(squares);

            if (winningMoves) {
                declareWinner(winningMoves, justPlayed);
                setWinningMoves(winningMoves);
            }

            toggleCurrentPlayer();
        }
    }, [userSymbol, user.status])

    useEffect(function () {
        if (canPlay && !gameEnd) {
            startTimer();
        } else {
            stopTimer();
        }
    }, [canPlay, gameEnd]);

    useGameEventSource<{ playerId: Player['identifier'] }>(urls.disconnect, function ({ event, payload }) {
        if (event === GameEvent.DISCONNECT) {
            const { playerId } = payload;
            if (playerId === user.identifier) {
                changeUserStatus(PlayerStatus.DISCONNECTED);
            } else {
                changeUserStatus(PlayerStatus.WON);
                changeOpponentStatus(PlayerStatus.DISCONNECTED);
            }
        }
    })

    return (
        <div className='w-full flex flex-col items-center justify-center flex-wrap'>
            <div className='mb-5'>
                <h2 className='title-secondary mb-3 w-fit'>
                    {getCurrentStatus(user, canPlay)}
                </h2>
                { (opponent!.status === PlayerStatus.DISCONNECTED || user.status === PlayerStatus.DISCONNECTED) ? (
                    <span className='inline-block text-center w-full text-xl'>
                        Time's Up!
                    </span>
                ): <Timer /> }
            </div>
            <div className="grid grid-rows-3 grid-cols-3 gap-3 bg-theme-accent-2 w-5/6 max-w-5/6 aspect-square p-5 rounded-lg md:p-10 lg:w-2/5 lg:max-w-2/5 shadow-xl">
                {squares.map(function (square, index) {
                    return (
                        <Square
                            highlighted={winningMoves.includes(index)}
                            key={index}
                            value={square}
                            onClick={() => onSquareClick(index)}
                        />
                    );
                })}
            </div>
        </div>
    )
}

function getCurrentStatus (user: Player, canPlay: boolean) {
    if (user.status === PlayerStatus.WON) {
        return 'You Won!';
    }

    if (user.status === PlayerStatus.LOST || user.status === PlayerStatus.DISCONNECTED) {
        return 'You Lost!';
    }

    if (user.status === PlayerStatus.DREW) {
        return 'It\'s a Draw!';
    }

    if (canPlay) {
        return 'Your Turn';
    }

    return 'Opponent\'s Turn';
}
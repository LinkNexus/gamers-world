import {create} from "zustand/react";
import {Player} from "@/react/Games/types";
import {createSelectors} from "@/react/utils";
import {combine} from "zustand/middleware";
import {GameName, GameType, PlayerStatus, TicTacToeSymbol, TimerStatus} from "@/react/Games/types/enums";

declare global {
    interface Window {
        game: {
            user: Omit<Omit<Player, 'status'>, 'previousStatus'>,
            initiator: string,
            urls: Record<"join"|"synchronization"|"isReady"|"disconnect"|"play", 'string'>,
            turnTime: number,
            type: GameType,
            name: GameName
        }
    }
}

const { user, initiator, urls, turnTime, type, name } = window.game;

const useGameStore = createSelectors(
    create(
        combine(
            {
                user: { ...user, status: PlayerStatus.WAITING, previousStatus: PlayerStatus.WAITING } as Player,
                opponent: null as Player|null,
                initiator: initiator,
                urls: urls,
                turnTime: turnTime,
                type: type,
                name: name,
                ticTacToe: {
                    squares: Array(9).fill(null) as TicTacToeSymbol[],
                    currentPlayer: 'X' as TicTacToeSymbol,
                    user: null as TicTacToeSymbol,
                    opponent: null as TicTacToeSymbol,
                },
                timer: {
                    initialTime: turnTime,
                    timeLeft: turnTime,
                    status: TimerStatus.STOPPED
                }
            },
            (set) => ({
                setOpponent: function (opponent: Player|null) {
                    set(function (state) {
                        return { ...state, opponent };
                    })
                },
                changeUserStatus: function (status: PlayerStatus) {
                    set(function (state) {
                        return {
                            ...state,
                            user: {
                                ...state.user,
                                previousStatus: state.user.status,
                                status: status
                            }
                        }
                    })
                },
                changeOpponentStatus: function (status: PlayerStatus) {
                    set(function (state) {
                        return {
                            ...state,
                            opponent: state.opponent ? {
                                ...state.opponent,
                                status
                            } : null
                        }
                    })
                },
                kickOpponent: function () {
                    set(function (state) {
                        return { ...state, opponent: null, user: { ...state.user, status: PlayerStatus.WAITING } }
                    })
                },
                ticTacToeActions: {
                    setSquares: function (squares: TicTacToeSymbol[]) {
                        set(function (state) {
                            return { ...state, 'ticTacToe': { ...state.ticTacToe, squares: squares } }
                        })
                    },
                    startGame: function () {
                        set(function (state) {
                            return {
                                ...state,
                                user: {
                                    ...state.user,
                                    status: PlayerStatus.PLAYING
                                },
                                opponent: {
                                    ...state.opponent!,
                                    status: PlayerStatus.PLAYING
                                },
                                ticTacToe: {
                                    ...state.ticTacToe,
                                    user: state.initiator === state.user.identifier ? 'X' : 'O',
                                    opponent: state.initiator === state.user.identifier ? 'O' : 'X',
                                }
                            }
                        })
                    },
                    toggleCurrentPlayer: function () {
                        set(function (state) {
                            return {
                                ...state,
                                ticTacToe: {
                                    ...state.ticTacToe,
                                    currentPlayer: state.ticTacToe.currentPlayer === 'X' ? 'O' : 'X'
                                }
                            }
                        })
                    },
                    declareWinner: function (winningMoves: number[], winner: TicTacToeSymbol) {
                        set(function (state) {
                            const { ticTacToe: { user } } = state;

                            if (winningMoves.length === 0) {
                                return { ...state, user: { ...state.user, status: PlayerStatus.DREW } }
                            }

                            return {
                                ...state,
                                user: {
                                    ...state.user,
                                    status: user === winner ? PlayerStatus.WON : PlayerStatus.LOST
                                },
                                ticTacToe: {
                                    ...state.ticTacToe,
                                    winningMoves: winningMoves
                                }
                            }
                        })
                    }
                },
                timerActions: {
                    start: function () {
                        set(function (state) {
                            return {
                                ...state,
                                timer: {
                                    ...state.timer,
                                    status: TimerStatus.RUNNING
                                }
                            }
                        })
                    },
                    stop: function () {
                        set(function (state) {
                            return {
                                ...state,
                                timer: {
                                    ...state.timer,
                                    timeLeft: state.timer.initialTime,
                                    status: TimerStatus.STOPPED
                                }
                            }
                        })
                    },
                    pause: function () {
                        set(function (state) {
                            return {
                                ...state,
                                timer: {
                                    ...state.timer,
                                    status: TimerStatus.PAUSED
                                }
                            }
                        })
                    },
                    decrement: function () {
                        set(function (state) {
                            return {
                                ...state,
                                timer: {
                                    ...state.timer,
                                    timeLeft: state.timer.timeLeft - 1
                                }
                            }
                        })
                    }
                }
            })
        )
    )
);

export default useGameStore;
import {create} from "zustand/react";
import {Player} from "@/react/Games/types";
import {createSelectors} from "@/react/utils";
import {combine} from "zustand/middleware";
import {ChifoumiChoice, PlayerStatus, TicTacToeSymbol, TimerStatus} from "@/react/Games/types/enums";
import {confetti} from "@tsparticles/confetti";

const difficultiesDurations = {
    1: [
        45,
        55,
        65
    ],
    2: [
        30,
        40,
        50
    ],
    3: [
        20,
        30,
        40
    ]
};
const { user, initiator, urls, type, name, duration, difficulty, identifier } = window.game;
const memoryGameCards = [
    'bear',
    'bear-cat',
    'giraffe',
    'gorilla',
    'kangaroo',
    'koala',
    'leopard',
    'lion',
    'orca',
    'panda',
    'pangolin',
    'penguin',
    'rhino',
    'toucan',
    'warthog',
    'wolf',
]

const useGameStore = createSelectors(
    create(
        combine(
            {
                user: { ...user, status: PlayerStatus.WAITING, previousStatus: PlayerStatus.WAITING } as Player,
                opponent: null as Player|null,
                initiator: initiator,
                urls: urls,
                type: type,
                name: name,
                identifier: identifier,
                ticTacToe: {
                    squares: Array(9).fill(null) as TicTacToeSymbol[],
                    currentPlayer: 'X' as TicTacToeSymbol,
                    user: null as TicTacToeSymbol,
                    opponent: null as TicTacToeSymbol,
                },
                timer: {
                    initialTime: duration || difficultiesDurations[difficulty || 1][0],
                    timeLeft: duration || difficultiesDurations[difficulty || 1][0],
                    status: TimerStatus.STOPPED
                },
                chifoumi: {
                    opponent: null as ChifoumiChoice|null,
                    user: null as ChifoumiChoice|null
                },
                memoryGame: {
                    cards: [] as string[],
                    currentLevel: 1,
                    maxLevel: 3,
                    flippedCards: [] as number[],
                    history: [] as number[]
                }
            },
            (set, get) => ({
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
                },
                chifoumiActions: {
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
                                }
                            }
                        })
                    },
                    setOpponentChoice: function (choice: ChifoumiChoice) {
                        set(function (state) {
                            return {
                                ...state,
                                chifoumi: {
                                    ...state.chifoumi,
                                    opponent: choice
                                }
                            }
                        })
                    },
                    setUserChoice: function (choice: ChifoumiChoice) {
                        set(function (state) {
                            return {
                                ...state,
                                chifoumi: {
                                    ...state.chifoumi,
                                    user: choice
                                }
                            }
                        })
                    }
                },
                memoryGameActions: {
                    startGame: function () {
                        set(function (state) {
                            return {
                                ...state,
                                user: {
                                    ...state.user,
                                    status: PlayerStatus.PLAYING
                                },
                            }
                        })
                    },
                    setCards: function () {
                        set(function (state) {
                            const currentLevel = state.memoryGame.currentLevel;
                            const cards: string[] = Array((currentLevel + 1) * 4);

                            function getRandomIndex () {
                                const index = Math.floor(Math.random() * cards.length);
                                if (cards[index]) return getRandomIndex();
                                return index;
                            }

                            for (let i = 0; i < 2 * (currentLevel + 1); i++) {
                                const randomCardIndex = Math.floor(Math.random() * memoryGameCards.length);
                                if (cards.includes(memoryGameCards[randomCardIndex])) {
                                    i--;
                                    continue;
                                }
                                cards[getRandomIndex()] = memoryGameCards[randomCardIndex];
                                cards[getRandomIndex()] = memoryGameCards[randomCardIndex];
                            }

                            return {
                                ...state,
                                memoryGame: {
                                    ...state.memoryGame,
                                    cards: cards
                                }
                            }
                        })
                    },
                    flipCard: function (index: number) {
                        set(function (state) {
                            if (state.memoryGame.flippedCards.length === 2) {
                                return state;
                            }

                            return {
                                ...state,
                                memoryGame: {
                                    ...state.memoryGame,
                                    flippedCards: [...state.memoryGame.flippedCards, index]
                                }
                            }
                        })
                    },
                    checkMatch: function () {
                        set(function (state) {
                            const [firstCard, secondCard] = state.memoryGame.flippedCards;
                            const [firstValue, secondValue] = [
                                state.memoryGame.cards[firstCard],
                                state.memoryGame.cards[secondCard]
                            ];

                            const newState = {
                                ...state,
                                memoryGame: {
                                    ...state.memoryGame,
                                    flippedCards: []
                                }
                            };

                            if (firstValue === secondValue) {
                                newState.memoryGame.history.push(firstCard, secondCard);
                                return newState;
                            }

                            return newState;
                        })
                    },
                    switchLevel: function () {
                        set(function (state) {
                            return {
                                ...state,
                                memoryGame: {
                                    ...state.memoryGame,
                                    currentLevel: state.memoryGame.currentLevel + 1,
                                    history: []
                                },
                                timer: {
                                    ...state.timer,
                                    timeLeft: difficultiesDurations[difficulty || 1][state.memoryGame.currentLevel]
                                }
                            }
                        })
                    }
                },
                celebrate: function () {
                    const duration = 15 * 1000,
                        animationEnd = Date.now() + duration,
                        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                    function randomInRange(min: number, max: number) {
                        return Math.random() * (max - min) + min;
                    }

                    const interval = setInterval(function() {
                        const timeLeft = animationEnd - Date.now();

                        if (timeLeft <= 0) {
                            return clearInterval(interval);
                        }

                        const particleCount = 50 * (timeLeft / duration);

                        // since particles fall down, start a bit higher than random
                        confetti(
                            Object.assign({}, defaults, {
                                particleCount,
                                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                            })
                        );
                        confetti(
                            Object.assign({}, defaults, {
                                particleCount,
                                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                            })
                        );
                    }, 250);
                },
            })
        )
    )
);

export default useGameStore;
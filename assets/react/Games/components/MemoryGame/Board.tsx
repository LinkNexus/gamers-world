import Card from "@/react/Games/components/MemoryGame/Card";
import useGameStore from "@/react/Games/store";
import {useEffect} from "react";
import Timer from "@/react/Games/components/common/Timer";
import {GameEvent, GameType, PlayerStatus} from "@/react/Games/types/enums";
import {useGameEventSource, useGameFetch} from "@/react/Games/utils";
import {Player} from "@/react/Games/types";
import {useDelay} from "@/react/utils";

/**
 * React functional component for a memory game.
 *
 * This component manages and renders a memory game, handling game state such as user actions,
 * flipped cards, game levels, and the player's status. It includes logic for single-player
 * and multiplayer modes and integrates with the `useGameStore` custom hook to manage game state.
 * Various game events such as card flips, matches, level transitions, and disconnections are
 * also handled using the `useGameEventSource` and `dispatchGameEvent` hooks.
 *
 * Internal logic includes:
 * - Handling card clicks, flipping cards, and sending play events.
 * - Responding to game events like card plays by other players and disconnections.
 * - Automatically checking for matches between flipped cards.
 * - Transitioning between levels and handling game completion.
 * - Updating and rendering the game board, user status, and timer or level status.
 */

export default function () {
    const user = useGameStore.use.user();
    const cards = useGameStore.use.memoryGame().cards;
    const flippedCards = useGameStore.use.memoryGame().flippedCards;
    const history = useGameStore.use.memoryGame().history;
    const currentLevel = useGameStore.use.memoryGame().currentLevel;
    const urls = useGameStore.use.urls();
    const maxLevel = useGameStore.use.memoryGame().maxLevel;
    const gameType = useGameStore.use.type();
    const actualPlayer = useGameStore.use.memoryGame().actualPlayer;
    const userPoints = useGameStore.use.memoryGame().userPoints;
    const opponentPoints = useGameStore.use.memoryGame().opponentPoints;
    const gameDifficulty = useGameStore.use.difficulty();
    const gameName = useGameStore.use.name();
    const flipCard = useGameStore.getState().memoryGameActions.flipCard;
    const checkMatch = useGameStore.getState().memoryGameActions.checkMatch;
    const changeUserStatus = useGameStore.getState().changeUserStatus;
    const stopTimer = useGameStore.getState().timerActions.stop;
    const switchLevel = useGameStore.getState().memoryGameActions.switchLevel;
    const setCards = useGameStore.getState().memoryGameActions.setCards;
    const startTimer = useGameStore.getState().timerActions.start;
    const switchPlayer = useGameStore.getState().memoryGameActions.switchPlayer;

    const versus = [GameType.OPPONENT, GameType.FRIEND, GameType.COMPUTER].includes(gameType);
    const againstComputer = gameType === GameType.COMPUTER;

    const {dispatchGameEvent} = useGameFetch();

    async function onCardClick(index: number) {
        if (user.status !== PlayerStatus.PLAYING) return;
        if (versus && actualPlayer !== user.identifier) return;
        if (flippedCards.includes(index) || history.includes(index)) {
            return;
        }

        flipCard(index);

        if (versus) {
            await dispatchGameEvent({
                event: GameEvent.PLAY,
                payload: {
                    justPlayed: user.identifier,
                    card: index,
                    againstComputer: false
                }
            })
        }
    }

    useGameEventSource<{ justPlayed: string, card?: number, cards?: number[] }>(urls.play, function ({ event, payload}) {
        console.log(payload);
        const { justPlayed, card, cards } = payload;
        if (event === GameEvent.PLAY) {
            if (justPlayed !== user.identifier) {
                if (card) {
                    flipCard(card);
                }

                if (cards) {
                    for (const c of cards) {
                        // useDelay(1000);
                        setTimeout(async function () {
                            flipCard(c);
                        }, 1000)
                    }
                }
            }
        }
    }, [user.identifier])

    useEffect(function () {
        if (flippedCards.length === 2) {
            setTimeout(async function () {
                checkMatch();

                if (versus) {
                    if (actualPlayer === user.identifier) {
                        stopTimer();

                        if (againstComputer) {
                            await dispatchGameEvent({
                                event: GameEvent.PLAY,
                                payload: {
                                    justPlayed: user.identifier,
                                    history: history,
                                    cards,
                                    againstComputer: true,
                                    gameDifficulty,
                                    gameName
                                }
                            })
                        }
                    } else
                        startTimer();

                    switchPlayer();
                }
            }, 1000);
        }
    }, [flippedCards]);

    useEffect(function () {
        if (history.length === (currentLevel + 1) * 4) {
            if (versus) {
                stopTimer();

                if (userPoints < opponentPoints)
                    changeUserStatus(PlayerStatus.LOST);
                else if (userPoints > opponentPoints)
                    changeUserStatus(PlayerStatus.WON);
                else
                    changeUserStatus(PlayerStatus.DREW);
            } else {
                if (currentLevel < maxLevel) {
                    setTimeout(function () {
                        switchLevel();
                        setCards();
                        startTimer();
                    })
                } else {
                    stopTimer();
                    changeUserStatus(PlayerStatus.WON);
                }
            }
        }
    }, [history.length]);

    useGameEventSource(urls.disconnect, function ({ event }) {
        if (event === GameEvent.DISCONNECT) {
            changeUserStatus(PlayerStatus.LOST);
            stopTimer();
        }
    })

    return (
        <div className='flex flex-col items-center justify-center flex-wrap w-fit'>
            <div className='mb-5 w-full'>
                <UserStatus againstUser={versus} actualPlayer={actualPlayer} user={user} />
                <div className='flex justify-between'>
                    { versus ? (
                        <span className='inline-flex gap-x-4 text-center w-fit text-xl'>
                            <span>Points: </span>
                            <span className='text-bold text-theme-primary'>{userPoints}</span>
                            <span>/</span>
                            <span className='text-bold text-red-500'>{opponentPoints}</span>
                        </span> ) : (
                            user.status === PlayerStatus.LOST ? (
                                <span className='inline-block text-center w-full text-xl'>
                                    Time's Up! c
                                </span>
                            ) : <Timer/>
                        )
                    }
                    <span className='inline-block text-center w-fit text-xl'>
                        { versus ? <Timer /> : <>Level: <strong>{currentLevel}</strong></> }
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3 bg-theme-accent-2 rounded-lg shadow-xl">
                {cards.map(function (card, index) {
                    return (
                        <Card
                            key={index}
                            value={card}
                            state={
                                flippedCards.includes(index) || history.includes(index) ?
                                "flipped" : "hidden"
                            }
                            onClick={function () {
                                onCardClick(index);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    )
}

function UserStatus ({ user, actualPlayer, againstUser }: {
    user: Player,
    actualPlayer: string,
    againstUser: boolean
}) {
    const status = '';

    if ([PlayerStatus.WON, PlayerStatus.LOST].includes(user.status)) {
        return (
            <h2 className='title-secondary mb-5 w-fit'>
                {user.status === PlayerStatus.WON ? "You Won!" : "You Lost!"}
            </h2>
        );
    }

    if (againstUser) {
        return (
            <h2 className='title-secondary mb-5 w-fit'>
                {actualPlayer === user.identifier ? "Your Turn" : "Opponent's Turn"}
            </h2>
        )
    }
}
import Board from "@/react/Games/components/MemoryGame/Board";
import {useEffect} from "react";
import useGameStore from "@/react/Games/store";
import {GameEvent, GameType} from "@/react/Games/types/enums";
import {useGameEventSource, useGameFetch} from "@/react/Games/utils";
import {stimulusController} from "@/react/utils";

/**
 * Component for managing the memory game logic and user interface.
 * Handles synchronization, game state initialization, and user interactions
 * based on the game type and role (initiator or non-initiator).
 * It integrates game state actions, event listeners, and rendering conditions
 * for the memory game.
 *
 * The component uses the following:
 * - Subscribes to state and actions from the `useGameStore`, including memory game card management, timer, and game type.
 * - Dispatches and listens to game-related events for synchronization purposes.
 * - Manages rendering based on the state of the game (loading or game board).
 * - Starts the game and timer based on synchronization events or local initialization.
 *
 * Dependencies:
 * - `useGameStore`: Custom hook for accessing memory game, timer, and synchronization state/actions.
 * - `useEffect`: React hook for performing side effects such as synchronizing game initialization.
 * - `useGameFetch`: Custom hook to perform game event dispatching.
 * - `useGameEventSource`: Custom hook for listening to server-sent events (synchronization).
 *
 * Key Functionalities:
 * - Initializes memory cards and starts the game based on the type of game and user role.
 * - Synchronizes game state when participating in games involving friends or opponents.
 * - Listens to server-sent synchronization events and updates the card set accordingly.
 * - Renders a spinner when cards are loading or the game is not initialized, otherwise renders the game board.
 *
 * Rendering:
 * - If no cards are set, displays a spinner.
 * - If cards are available, renders the `Board` component for the game interface.
 *
 * Effects:
 * - `useEffect` monitors the length of the card array to either synchronize the game state or initialize the game locally.
 * - `useGameEventSource` listens to synchronization events and updates the game state accordingly.
 */

export default function () {
    const setCards = useGameStore.getState().memoryGameActions.setCards;
    const startTimer = useGameStore.getState().timerActions.start;
    const startGame = useGameStore.getState().memoryGameActions.startGame;
    const gameType = useGameStore.use.type();
    const cards = useGameStore.use.memoryGame().cards;
    const urls = useGameStore.use.urls();
    const initiator = useGameStore.use.initiator();
    const user = useGameStore.use.user();

    const { dispatchGameEvent } = useGameFetch();

    useEffect(function () {
        if ([GameType.FRIEND, GameType.OPPONENT, GameType.COMPUTER].includes(gameType)) {
            if (user.identifier === initiator) {
                if (cards.length === 0)
                    setCards();

                dispatchGameEvent({
                    event: GameEvent.SYNCHRONIZE,
                    payload: {
                        cards: cards
                    }
                })
            }
        } else {
            setCards();
            startGame();
            startTimer();
        }
    }, [cards.length]);

    useGameEventSource<{ cards: string[] }>(urls.synchronization, function ({ event, payload }) {
        if (event === GameEvent.SYNCHRONIZE) {
            startGame();

            if (user.identifier !== initiator) {
                setCards(payload.cards);
            } else {
                startTimer();
            }
        }
    }, [user.identifier, initiator])

    return (
        <div className="w-full min-h-screen flex flex-wrap flex-col content-center justify-center px-5">
            {
                cards.length === 0 ? (
                    <div {...stimulusController('spinner')}></div>
                ): <Board />
            }
        </div>
    );
}
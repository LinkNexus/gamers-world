import {useEffect} from "react";
import type {Player} from "@/react/Games/types";
import useGameStore from "@/react/Games/store";
import {useToggle} from "@/react/utils";
import {GameEvent, PlayerStatus} from "@/react/Games/types/enums";
import Structure from "@/react/Games/components/common/WaitingQueue/Structure";
import {useGameEventSource, useGameFetch} from "@/react/Games/utils";

/**
 * Waiting queue component where the opponent player will be set
 */
export default function () {
    // States from the store
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const initiator = useGameStore.use.initiator();
    const urls = useGameStore.use.urls();
    const setOpponent = useGameStore.getState().setOpponent;
    const changeUserStatus = useGameStore.getState().changeUserStatus;
    const changeOpponentStatus = useGameStore.getState().changeOpponentStatus;

    // For some reason, when toggleStatus is called
    // the status is not updated the first time
    const [status, toggleStatus] = useToggle(PlayerStatus.READY, PlayerStatus.FOUND_OPPONENT);
    const isReady = status !== PlayerStatus.READY;

    // Fetch function to dispatch the game events
    const { dispatchGameEvent } = useGameFetch();

    // When a player joins the game, send the request to join and listen the
    // event source to get the player that joined on the opponent side
    useEffect(() => {
        dispatchGameEvent({
            event: GameEvent.JOIN,
            payload: {
                player: user
            }
        });
    }, [dispatchGameEvent, user.identifier]);

    useGameEventSource<{ player: Player }>(urls.join, function ({ event, payload: { player } }){
        if (event === GameEvent.JOIN && player.identifier !== user.identifier) {
            setOpponent(player);
        }
    }, [user.identifier]);

    // When one of the players have the opponent set, synchronize
    // the state of the 2 players to get the opponent set on the other side
    useEffect(() => {
        if (opponent) {
            dispatchGameEvent({
                event: GameEvent.SYNCHRONIZE,
                payload: {
                    player: user
                }
            });
        }
    }, [opponent?.identifier, user.identifier, dispatchGameEvent]);

    useGameEventSource<{ player: Player }>(urls.synchronization, ({ event, payload: { player } }) => {
        if (event === GameEvent.SYNCHRONIZE) {
            console.log(1)
            if (!opponent) {
                setOpponent(player);
            }

            changeUserStatus(PlayerStatus.FOUND_OPPONENT);
            changeOpponentStatus(PlayerStatus.FOUND_OPPONENT);
        }
    }, [opponent?.identifier]);

    // When the player status (ready or not) changes, 
    // notify the other player(s)
    async function toggleCheck () {
        // This does not update the status during the first call!
        toggleStatus();
        changeUserStatus(status);
        await dispatchGameEvent({
            event: GameEvent.IS_READY,
            payload: {
                playerId: user.identifier, status
            }
        });
    }

    useGameEventSource<{
        playerId: Player['identifier'],
        status: PlayerStatus
    }>(urls.isReady, function ({ event, payload }) {
        const { playerId, status } = payload;
        if (event === GameEvent.IS_READY && playerId !== user.identifier) {
            changeOpponentStatus(status);
        }
    }, [user.identifier]);

    // Listen for the event to kick the opponent out of the game
    useGameEventSource<{
        playerId: Player['identifier']
    }>(urls.disconnect, function ({ event, payload: { playerId } }){
        if (event === GameEvent.DISCONNECT) {
            if (playerId === opponent?.identifier) {
                useGameStore.getState().kickOpponent();
            } else {
                useGameStore.getState().changeUserStatus(PlayerStatus.DISCONNECTED);
            }
        }
    }, [opponent?.identifier]);

    async function kickOpponent () {
        await dispatchGameEvent({
            event: GameEvent.DISCONNECT,
            payload: {
                playerId: opponent?.identifier
            }
        })
    }

    if (user.status === PlayerStatus.DISCONNECTED) {
        return (
            <div>
                You was kicked out of the game
            </div>
        );
    }

    return (
        <Structure
            user={user}
            opponent={opponent}
            isReady={isReady}
            toggleCheck={toggleCheck}
            kickOpponent={kickOpponent}
            initiator={initiator}
        />
    );
}
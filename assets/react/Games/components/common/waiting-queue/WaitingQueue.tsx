import {useEffect} from "react";
import type {Player} from "@/react/Games/types";
import useGameStore from "@/react/Games/store";
import {useEventSource, useFetch, useToggle} from "@/react/utils";
import {PlayerStatus} from "@/react/Games/types/enums";
import Structure from "@/react/Games/components/common/waiting-queue/Structure";

interface Props {
    joinUrl: string;
    synchronizationUrl: string;
    isReadyUrl: string;
    disconnectUrl: string;
}

/**
 * Waiting queue component where the opponent player will be set
 */
export default function ({ joinUrl, synchronizationUrl, isReadyUrl, disconnectUrl }: Props) {
    // States from the store
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const initiator = useGameStore.use.initiator();
    const setOpponent = useGameStore.getState().setOpponent;
    const changeUserStatus = useGameStore.getState().changeUserStatus;

    // For some reason, when toggleStatus is called
    // the status is not updated the first time
    const {state: status, toggleState: toggleStatus} = useToggle(PlayerStatus.READY, PlayerStatus.FOUND_OPPONENT);
    const isReady = status !== PlayerStatus.READY;

    // Fetch functions
    const { load: joinGame } = useFetch('/games/server/events/join');
    const { load: synchronizePlayers } = useFetch('/games/server/events/players/synchronize');
    const { load: notifyReady } = useFetch('/games/server/events/players/is-ready');
    const { load: kickOpps } = useFetch('/games/server/events/players/disconnect');

    // When a player joins the game, send the request to join and listen the
    // event source to get the player that joined on the opponent side
    useEffect(() => {
        joinGame(user);
    }, [joinGame, user.identifier]);

    useEventSource(joinUrl, (player: Player) => {
        if (player.identifier !== user.identifier) {
            setOpponent(player);
        }
    }, [user.identifier]);

    // When one of the players have the opponent set, synchronize
    // the state of the 2 players to get the opponent set on the other side
    useEffect(() => {
        if (opponent) {
            synchronizePlayers(user);
        }
    }, [opponent?.identifier, user.identifier, synchronizePlayers]);

    useEventSource(synchronizationUrl, (player: Player) => {
        if (!opponent) {
            setOpponent(player);
        }

        changeUserStatus(PlayerStatus.FOUND_OPPONENT);
        useGameStore.getState().changeOpponentStatus(PlayerStatus.FOUND_OPPONENT);
    }, [opponent?.identifier]);

    // When the player status (ready or not) changes, 
    // notify the other player(s)
    async function toggleCheck () {
        // This does not update the status during the first call!
        toggleStatus();
        changeUserStatus(status);
        await notifyReady({ playerId: user.identifier, status });
    }

    useEventSource(isReadyUrl, ({ playerId, status }: { playerId: Player['identifier'], status: PlayerStatus }) => {
        if (playerId !== user.identifier) {
            useGameStore.getState().changeOpponentStatus(status);
        }
    }, [user.identifier]);

    // Listen for the event to kick the opponent out of the game
    useEventSource(disconnectUrl, (playerId: Player['identifier']) => {
        if (playerId === opponent?.identifier) {
            useGameStore.getState().kickOpponent();
        } else {
            useGameStore.getState().changeUserStatus(PlayerStatus.DISCONNECTED);
        }
    }, [opponent?.identifier]);

    return (
        <Structure
            user={user} 
            opponent={opponent} 
            isReady={isReady} 
            toggleCheck={toggleCheck} 
            kickOpps={kickOpps}
            initiator={initiator}
        />
    );
}
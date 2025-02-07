import {useEffect, useMemo} from "react";
import SplitScreen from "@/react/components/games/common/SplitScreen";
import type {Player} from "@/react/types";
import Spinner from "@/react/components/utilities/Spinner";
import useGameStore from "@/react/stores/game-store";
import {useEventSource, useFetch, useToggle} from "@/react/utils";
import {PlayerStatus} from "@/react/types/enums";

interface Props {
    joinUrl: string;
    synchronizationUrl: string;
    isReadyUrl: string;
}

enum OpponentState {
    IN_SEARCH = 'Waiting for other players...',
    FOUND = 'Opponent found!',
    READY = 'Opponent is ready to play!',
}

/**
 * Waiting queue component where the opponent player will be set
 */
export default function ({ joinUrl, synchronizationUrl, isReadyUrl }: Props) {
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
    const {state: status, toggleState: toggleStatus} = useToggle(PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY);
    const {state: test, toggleState: toggleTest} = useToggle(true, false);
    const isReady = status === PlayerStatus.READY;

    const opponentState = useMemo(function (){
        return toggleOpponentState(opponent);
    }, [opponent?.status]);

    const structure = useMemo(function () {
            return Structure(user, opponent, isReady, toggleCheck, opponentState);
        },
        [user.status, opponent?.identifier, isReady, opponentState]
    );

    const { load: joinGame } = useFetch('/games/server/events/join');
    const { load: synchronizePlayers } = useFetch('/games/server/events/players/synchronize');
    const { load: notifyReady } = useFetch('/games/server/events/players/is-ready'); 

    async function toggleCheck () {
        toggleStatus();
        toggleTest();
        console.log(status, test);
        await notifyReady({ playerId: user.identifier, status });
    }

    // When a player joins the game, send the request to join and listen the
    // event source to get the player that joined on the opponent side
    useEffect(() => {
        joinGame(user);
    }, [joinGame, user.identifier]);

    useEventSource(joinUrl, (player: Player) => {
        if (player.identifier !== user.identifier) {
            useGameStore.getState().setOpponent(player);
        }
    })

    // When one of the players have the opponent set, synchronize
    // the state of the 2 players to get the opponent set on the other side
    useEffect(() => {
        if (opponent) {
            synchronizePlayers(user);
        }
    }, [opponent?.identifier, user.identifier, synchronizePlayers]);

    useEventSource(synchronizationUrl, (player: Player) => {
        if (!opponent) {
            useGameStore.getState().setOpponent(player);
        }

        useGameStore.getState().changeUserStatus(PlayerStatus.FOUND_OPPONENT);
    }, [opponent?.identifier]);

    // When the player status (ready or not) changes, 
    // notify the other player(s)
    useEventSource(isReadyUrl, ({ playerId, status }: { playerId: string, status: PlayerStatus }) => {
        if (playerId !== user.identifier) {
            useGameStore.getState().changeOpponentStatus(status);
        }
    });

    return <SplitScreen { ...structure } />
}

/**
 * Represents the structure of the component to be exported
 */

function Structure(
    user: Player, 
    opponent: Player|null, 
    isReady: boolean, 
    toggleCheck: () => void,
    opponentState: OpponentState
) {
    return {
        playerSide: (
            <>
                <div className='image'>
                    <img src={`/images/users/${user.image}`} alt='profile-image'/>
                </div>
                <div className='header'>
                    <h1>
                        <span>Player:</span>
                        <span>{user.username}</span>
                    </h1>
                    <span className='opponent-state'>{opponentState}</span>
                </div>

                {
                    ([PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY].includes(user.status)) && (
                        <div className='mt-5 flex gap-x-2 items-center'>
                            <input checked={isReady} onChange={toggleCheck} type='checkbox' id='is-player-ready' />
                            <label className='font-semibold' htmlFor='is-player-ready'>Ready?</label>
                        </div>
                    )
                }
            </>
        ),

        opponentSide: !opponent ? <Spinner /> : (
            <>
                <div className='image'>
                    <img src={`/images/users/${opponent.image}`} alt='profile-image'/>
                </div>
                <div className='header'>
                    <h1>
                        <span>Opponent:</span>
                        <span>{opponent.username}</span>
                    </h1>
                </div>
            </>
        )
    }
}

function toggleOpponentState (opponent: Player | null) {

    if (!opponent) {
        return OpponentState.IN_SEARCH;
    }

    if (opponent.status === PlayerStatus.READY) {
        return OpponentState.READY;
    }

    return OpponentState.FOUND;
}
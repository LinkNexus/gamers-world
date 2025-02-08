import {memo, useEffect, useMemo} from "react";
import SplitScreen from "@/react/Games/components/common/SplitScreen";
import type {Player} from "@/react/Games/types";
import Spinner from "@/react/Utilities/Spinner";
import useGameStore from "@/react/Games/store";
import {useEventSource, useFetch, useToggle} from "@/react/utils";
import {PlayerStatus} from "@/react/Games/types/enums";
import Timer from "./Timer";

interface Props {
    joinUrl: string;
    synchronizationUrl: string;
    isReadyUrl: string;
}

/**
 * Waiting queue component where the opponent player will be set
 */
export default function ({ joinUrl, synchronizationUrl, isReadyUrl }: Props) {
    // States from the store
    const user = useGameStore.use.user();
    const opponent = useGameStore.use.opponent();
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

    // When a player joins the game, send the request to join and listen the
    // event source to get the player that joined on the opponent side
    useEffect(() => {
        joinGame(user);
    }, [joinGame, user.identifier]);

    useEventSource(joinUrl, (player: Player) => {
        if (player.identifier !== user.identifier) {
            setOpponent(player);
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
            setOpponent(player);
        }

        changeUserStatus(PlayerStatus.FOUND_OPPONENT);
        useGameStore.getState().changeOpponentStatus(PlayerStatus.FOUND_OPPONENT);
    }, [opponent?.identifier]);

    // When the player status (ready or not) changes, 
    // notify the other player(s)
    async function toggleCheck () {
        // This does not update the status during the first call
        toggleStatus();
        changeUserStatus(status);
        await notifyReady({ playerId: user.identifier, status });
    }

    useEventSource(isReadyUrl, ({ playerId, status }: { playerId: string, status: PlayerStatus }) => {
        if (playerId !== user.identifier) {
            useGameStore.getState().changeOpponentStatus(status);
        }
    });

    return (
        <Structure
            user={user} 
            opponent={opponent} 
            isReady={isReady} 
            toggleCheck={toggleCheck} 
        />
    );
}

/**
 * Represents the structure of the component to be exported
 */

interface StructureProps {
    user: Player;
    opponent: Player | null;
    isReady: boolean;
    toggleCheck: () => void;
}

const Structure = memo(function ({ user, opponent, isReady, toggleCheck }: StructureProps) {
    const playerSide = (
        <>
            <div className='image'>
                <img src={`/images/users/${user.image}`} alt='profile-image' />
            </div>
            <div className='header'>
                <h1>
                    <span>Player:</span>
                    <span>{user.username}</span>
                </h1>
                <OpponentState status={opponent?.status} />
            </div>

            {
                ([PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY].includes(user.status)) && (
                    <>
                        <div className='mt-5 flex gap-x-2 items-center'>
                            <input checked={isReady} onChange={toggleCheck} type='checkbox' id='is-player-ready' />
                            <label className='font-semibold' htmlFor='is-player-ready'>Ready?</label>
                        </div>
                        <button type="button" className="min-h-20 bg-theme-primary">Kick</button>
                    </>                
                )
            }
        </>
    );

    const opponentSide = !opponent ? <Spinner /> : (
        <>
            <div className='image'>
                <img src={`/images/users/${opponent.image}`} alt='profile-image' />
            </div>
            <div className='header'>
                <h1>
                    <span>Opponent:</span>
                    <span>{opponent.username}</span>
                </h1>
            </div>
        </>
    );

    return <SplitScreen playerSide={playerSide} opponentSide={opponentSide} />
});

const OpponentState = memo(
    function ({ status }: { status: PlayerStatus | undefined }) {

        let text: string;

        if (!status || status === PlayerStatus.WAITING) {
            text = 'Waiting for other players...';
        } else if (status === PlayerStatus.READY) {
            text = 'Opponent is ready to play!';
        } else {
            text = 'Opponent found!';
        }

        return (
            <span className="opponent-state">
                {text}
            </span>
        )
    }
);
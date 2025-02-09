import type {Player} from "@/react/Games/types";
import {memo} from "react";
import {PlayerStatus} from "@/react/Games/types/enums";
import Spinner from "@/react/Utilities/Spinner";
import SplitScreen from "@/react/Games/components/common/SplitScreen";

interface Props {
    user: Player;
    opponent: Player | null;
    isReady: boolean;
    toggleCheck: () => void;
    kickOpps: (playerId: string) => void;
    initiator: string;
}

/**
 * Represents the structure of the component to be exported
 */

export default memo(function ({ user, opponent, isReady, toggleCheck, kickOpps, initiator }: Props) {
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

            {
                ([PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY].includes(user.status)) &&
                user.identifier === initiator &&
                (
                    <button
                        onClick={function () {
                            kickOpps(opponent.identifier);
                        }}
                        type="button"
                        className="button-secondary mt-4"
                    >
                        Kick
                    </button>
                )
            }
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
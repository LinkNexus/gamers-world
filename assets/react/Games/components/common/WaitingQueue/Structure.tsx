import type {Player} from "@/react/Games/types";
import {memo, PropsWithChildren} from "react";
import {GameType, PlayerStatus} from "@/react/Games/types/enums";
import Spinner from "@/react/Utilities/Spinner";
import SplitScreen from "@/react/Games/components/common/SplitScreen";
import Modal from "@/react/Games/components/common/WaitingQueue/Modal";

interface Props {
    user: Player;
    opponent: Player | null;
    isReady: boolean;
    toggleCheck: () => void;
    kickOpponent: () => Promise<void>;
    initiator: string;
    gameType: GameType;
}

/**
 * Represents the structure of the component to be exported
 */

export default memo(function ({ user, opponent, isReady, toggleCheck, kickOpponent, initiator, gameType }: Props) {
    const waitingForFriend = user.status === PlayerStatus.WAITING && gameType === GameType.FRIEND && !opponent && user.identifier === initiator;

    const playerSide = (
        <>
            <Header player={user} label="Player">
                <OpponentState status={opponent?.status} />
            </Header>

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

            {waitingForFriend && (
                <button className='button-primary mt-5' data-modal-target="copy-link-modal" data-modal-toggle="copy-link-modal">
                    Invite Friend
                </button>
            )}
        </>
    );

    const opponentSide = !opponent ? <Spinner /> : (
        <>
            <Header player={opponent} label="Opponent" />

            {
                ([PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY].includes(user.status)) &&
                user.identifier === initiator &&
                (
                    <button
                        onClick={kickOpponent}
                        type="button"
                        className="button-secondary mt-4"
                    >
                        Kick
                    </button>
                )
            }
        </>
    );

    return (
        <>
            <SplitScreen playerSide={playerSide} opponentSide={opponentSide} />
            { waitingForFriend && <Modal /> }
        </>
    );
});

function Header ({ player, label, children }: PropsWithChildren<{ player: Player, label: "Player"|"Opponent" }>) {
    return (
        <>
            <div className='h-fit w-fit rounded-full border-2 border-slate-300'>
                <img className='rounded-full bg-slate-500 w-32 h-32 object-cover md:w-48 md:h-48' src={`/images/users/${player.image}`} alt='profile-image' />
            </div>
            <div className='mt-3 w-full max-w-full flex flex-col gap-y-2'>
                <h1 className='font-bold text-2xl flex flex-wrap flex-col items-center gap-y-2 text-ellipsis px-3 md:text-3xl'>
                    <span className='max-w-full text-ellipsis overflow-hidden'>
                        {label}:
                    </span>
                    <span className='max-w-full text-ellipsis overflow-hidden'>{player.username}</span>
                </h1>
                {children}
            </div>
        </>
    );
}

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
            <span className="w-fit self-center">
                {text}
            </span>
        )
    }
);
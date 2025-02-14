import {Player} from "@/react/Games/types";
import {ChifoumiChoice, PlayerStatus} from "@/react/Games/types/enums";
import Card from "@/react/Games/components/Chifoumi/Card";
import SplitScreen from "@/react/Games/components/common/SplitScreen";
import {PropsWithChildren, Ref, RefObject} from "react";
import Timer from "@/react/Games/components/common/Timer";

interface Props {
    user: Player;
    opponent: Player;
    onCardClick: (value: ChifoumiChoice) => void;
    choiceRef: RefObject<HTMLDivElement|null>;
    cardsRef: RefObject<HTMLDivElement|null>;
    opponentChoice: ChifoumiChoice|null;
    userChoice: ChifoumiChoice|null;
}

export default function ({ user, opponent, onCardClick, choiceRef, cardsRef, opponentChoice, userChoice }: Props) {
    const cards = [
        ChifoumiChoice.PAPER,
        ChifoumiChoice.ROCK,
        ChifoumiChoice.SCISSORS
    ];

    const playerSide = (
        <>
            <Header player={user} />
            <Timer className='mt-5' />
            <CardContainer ref={cardsRef}>
                {cards.map(function (card, index) {
                    return (
                        <Card onClick={onCardClick} key={index} type={card} />
                    )
                })}
            </CardContainer>
            <CardContainer ref={choiceRef} />
        </>
    )

    const opponentSide = (
        <>
            <Header label='opponent' player={opponent} />
            {opponentChoice && userChoice && (
                <CardContainer>
                    <Card type={opponentChoice} />
                </CardContainer>
            )}
        </>
    );

    return <SplitScreen playerSide={playerSide} opponentSide={opponentSide} />
}

function Header ({ player, label = "user" }: { player: Player, label?: "opponent"|"user" }) {
    return (
        <div className='flex flex-col gap-y-8 items-center justify-center w-full'>
            {label === 'user' && (
                <PlayerStatusMessage status={player.status} />
            )}
            <div className='flex justify-center items-center gap-x-3 w-full max-w-full overflow-hidden px-3'>
                <div className='shrink-0 border-2 border-slate-300 rounded-full'>
                    <img className='w-20 md:w-24 aspect-square object-cover rounded-full bg-slate-500'
                         src={`/images/users/${player.image}`} alt='profile-image'/>
                </div>
                <span
                    className='text-xl font-bold text-ellipsis overflow-hidden max-w-full md:text-2xl'
                >
                    {player.username}
                </span>
            </div>
        </div>
    );
}

function CardContainer ({ ref, children }: PropsWithChildren & { ref?: Ref<HTMLDivElement|null> }) {
    return (
        <div ref={ref} className='w-full flex items-center justify-center gap-3 px-3 mt-5 md:mt-12'>
            {children}
        </div>
    );
}

function PlayerStatusMessage ({ status }: { status: PlayerStatus }) {
    if ([PlayerStatus.WON, PlayerStatus.LOST, PlayerStatus.DREW].includes(status)) {
        return (
            <h2 className='title-secondary'>
                {status === PlayerStatus.WON && 'You Won!'}
                {status === PlayerStatus.LOST && 'You Lost!'}
                {status === PlayerStatus.DREW && 'You Drew!'}
            </h2>
        );
    }
}
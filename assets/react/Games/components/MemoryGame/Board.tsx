import Card from "@/react/Games/components/MemoryGame/Card";
import useGameStore from "@/react/Games/store";
import {useEffect} from "react";
import Timer from "@/react/Games/components/common/Timer";
import {GameEvent, PlayerStatus} from "@/react/Games/types/enums";
import {useGameEventSource} from "@/react/Games/utils";

export default function () {
    const user = useGameStore.use.user();
    const cards = useGameStore.use.memoryGame().cards;
    const flippedCards = useGameStore.use.memoryGame().flippedCards;
    const history = useGameStore.use.memoryGame().history;
    const currentLevel = useGameStore.use.memoryGame().currentLevel;
    const urls = useGameStore.use.urls();
    const maxLevel = useGameStore.use.memoryGame().maxLevel;
    const flipCard = useGameStore.getState().memoryGameActions.flipCard;
    const checkMatch = useGameStore.getState().memoryGameActions.checkMatch;
    const changeUserStatus = useGameStore.getState().changeUserStatus;
    const stopTimer = useGameStore.getState().timerActions.stop;
    const switchLevel = useGameStore.getState().memoryGameActions.switchLevel;
    const setCards = useGameStore.getState().memoryGameActions.setCards;
    const startTimer = useGameStore.getState().timerActions.start;

    function onCardClick(index: number) {
        if (user.status !== PlayerStatus.PLAYING) return;
        if (flippedCards.includes(index) || history.includes(index)) {
            return;
        }

        flipCard(index);
    }

    useEffect(function () {
        if (flippedCards.length === 2) {
            setTimeout(function () {
                checkMatch();
            }, 1000);
        }
    }, [flippedCards]);

    useEffect(function () {
        if (history.length === (currentLevel + 1) * 4) {
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
    }, [history.length]);

    useGameEventSource(urls.disconnect, function ({ event }) {
        if (event === GameEvent.DISCONNECT) {
            changeUserStatus(PlayerStatus.LOST);
            stopTimer();
        }
    })

    return (
        <div className='w-full flex flex-col items-center justify-center flex-wrap'>
            <div className='mb-5 w-full'>
                <UserStatus userStatus={user.status} />
                <div className='flex justify-between'>
                    {user.status === PlayerStatus.LOST ? (
                        <span className='inline-block text-center w-full text-xl'>
                            Time's Up!
                        </span>
                    ) : <Timer/>}
                    <span className='inline-block text-center w-full text-xl'>
                        Level: <strong>{currentLevel}</strong>
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

function UserStatus ({ userStatus }: { userStatus: PlayerStatus }) {
    if ([PlayerStatus.WON, PlayerStatus.LOST].includes(userStatus)) {
        return (
            <h2 className='title-secondary mb-5 w-fit'>
                {userStatus === PlayerStatus.WON ? "You Won!" : "You Lost!"}
            </h2>
        );
    }
}
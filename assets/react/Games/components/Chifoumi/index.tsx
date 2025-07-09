import Structure from "@/react/Games/components/Chifoumi/Structure";
import useGameStore from "@/react/Games/store";
import {Player} from "@/react/Games/types";
import {ChifoumiChoice, GameEvent, GameType, PlayerStatus} from "@/react/Games/types/enums";
import {useEffect, useRef} from "react";
import Card from "@/react/Games/components/Chifoumi/Card";
import {createRoot} from "react-dom/client";
import {useGameEventSource, useGameFetch} from "@/react/Games/utils";
import {useDelay} from "@/react/utils";

export default function () {
    const user = useGameStore.use.user();
    const urls = useGameStore.use.urls();
    const opponentChoice = useGameStore.use.chifoumi().opponent;
    const userChoice = useGameStore.use.chifoumi().user;
    const opponent = useGameStore.use.opponent();
    const gameType = useGameStore.use.type();
    const gameName = useGameStore.use.name();
    const gameDifficulty = useGameStore.use.difficulty();
    const setUserChoice = useGameStore.getState().chifoumiActions.setUserChoice;
    const setOpponentChoice = useGameStore.getState().chifoumiActions.setOpponentChoice;
    const changeUserStatus = useGameStore.getState().changeUserStatus;
    const startGame = useGameStore.getState().chifoumiActions.startGame;
    const startTimer = useGameStore.getState().timerActions.start;
    const stopTimer = useGameStore.getState().timerActions.stop;
    const choiceRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const againstComputer = gameType === GameType.COMPUTER;

    const {dispatchGameEvent} = useGameFetch();

    useEffect(function () {
        startGame();
        startTimer();
    }, []);

    async function onCardClick (value: ChifoumiChoice) {
        if (user.status !== PlayerStatus.PLAYING) return;

        createRoot(choiceRef.current!).render(<Card type={value} />);
        cardsRef.current!.style.display = 'none';

        setUserChoice(value);

        await dispatchGameEvent({
            event: GameEvent.PLAY,
            payload: {
                choice: value,
                playerId: user.identifier,
                againstComputer,
                gameName,
                gameDifficulty
            }
        });
    }

    async function chooseWinner(userChoice: ChifoumiChoice, opponentChoice: ChifoumiChoice) {
        if (userChoice === opponentChoice) {
            changeUserStatus(PlayerStatus.DREW);
            return;
        }

        if (
            (userChoice === ChifoumiChoice.PAPER && opponentChoice === ChifoumiChoice.ROCK) ||
            (userChoice === ChifoumiChoice.ROCK && opponentChoice === ChifoumiChoice.SCISSORS) ||
            (userChoice === ChifoumiChoice.SCISSORS && opponentChoice === ChifoumiChoice.PAPER)
        ) {
            changeUserStatus(PlayerStatus.WON);
            return;
        }

        changeUserStatus(PlayerStatus.LOST);

        await useDelay(2000)
    }

    useGameEventSource<{
        choice: ChifoumiChoice,
        playerId: Player['identifier']
    }>(urls.play, function ({ event, payload }) {
        if (event === GameEvent.PLAY) {
            const {choice, playerId} = payload;
            if (playerId !== user.identifier) {
                if (againstComputer) {
                    setTimeout(function () {
                        setOpponentChoice(choice);
                    }, 1500)
                } else {
                    setOpponentChoice(choice);
                }
            }
        }
    })

    useEffect(() => {
        if (userChoice && opponentChoice) {
            stopTimer();
            chooseWinner(userChoice, opponentChoice);
        }
    }, [userChoice, opponentChoice]);

    useGameEventSource<{
        playerId: Player['identifier']
    }>(urls.disconnect, function ({ event, payload: { playerId } }) {
        if (event === GameEvent.DISCONNECT) {
            if (playerId === opponent?.identifier) {
                changeUserStatus(PlayerStatus.WON);
            } else {
                changeUserStatus(PlayerStatus.LOST);
            }

            stopTimer();
        }
    });

    return (
        <Structure
            choiceRef={choiceRef}
            cardsRef={cardsRef}
            onCardClick={onCardClick}
            user={user}
            opponent={opponent!}
            opponentChoice={opponentChoice}
            userChoice={userChoice}
        />
    );
}
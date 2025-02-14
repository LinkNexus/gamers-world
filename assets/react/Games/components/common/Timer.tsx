import useGameStore from "@/react/Games/store";
import {ComponentProps, useEffect} from "react";
import {GameEvent, TimerStatus} from "@/react/Games/types/enums";
import {useGameFetch} from "@/react/Games/utils";

export default function ({ className, ...props }: ComponentProps<'span'>) {
    const timeLeft = useGameStore.use.timer().timeLeft;
    const timerStatus = useGameStore.use.timer().status;
    const user = useGameStore.use.user();

    const { dispatchGameEvent } = useGameFetch()

    useEffect(function (){
        if (timeLeft <= 0) {
            dispatchGameEvent({
                event: GameEvent.DISCONNECT,
                payload: {
                    playerId: user.identifier
                }
            })
        }

        if (timerStatus === TimerStatus.RUNNING) {
            const interval = setInterval(() => {
                useGameStore.getState().timerActions.decrement();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timerStatus, timeLeft]);

    return (
        <span className={'inline-block text-center w-full text-xl ' + (timeLeft <= 10 ? ' text-red-500 ' : ' ') + className} {...props}>
            Time Left: {timeLeft}
        </span>
    );
}
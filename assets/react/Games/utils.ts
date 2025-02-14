import {useEventSource, useFetch} from "@/react/utils";
import {GameEvent} from "@/react/Games/types/enums";

// Add precision to the generic types of useEventSource and useFetch to
// make sure the data passed and obtain always includes the game event

export function useGameEventSource<T>(
    url: string,
    callback: (data: { event: GameEvent, payload: T }) => void,
    deps: any[] = []
) {
    return useEventSource<{ event: GameEvent, payload: T }>(url, callback, deps);
}

export function useGameFetch<S>()
{
    const { load, ...rest } = useFetch<{ event: GameEvent, payload: Record<string, any>}, S>(`/games/session/events/${window.game.identifier}`, {}, null);

    return {
        ...rest,
        dispatchGameEvent: load
    };
}
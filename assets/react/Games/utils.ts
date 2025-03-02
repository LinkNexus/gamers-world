import {useEventSource, useFetch} from "@/react/utils";
import {GameEvent} from "@/react/Games/types/enums";

/**
 * A custom hook that subscribes to a game event source, handling incoming events
 * and their associated payloads with the specified callback function.
 *
 * @param {string} url The URL of the event source to connect to.
 * @param {(data: { event: GameEvent, payload: T }) => void} callback A function invoked when a new event is received. It receives an object containing the event type and its associated payload.
 * @param {any[]} [deps=[]] An optional array of dependencies determining when the event source connection should be re-established.
 * @return {void} No return value. This hook manages the side effect of connecting to an event source.
 */

export function useGameEventSource<T>(
    url: string,
    callback: (data: { event: GameEvent, payload: T }) => void,
    deps: any[] = []
) {
    return useEventSource<{ event: GameEvent, payload: T }>(url, callback, deps);
}

/**
 * A custom hook that uses a fetch function to manage game-related data and events.
 * It provides functionality to dispatch game events and includes additional utilities returned by the `useFetch` hook.
 *
 * @template S The expected shape of the data returned by the fetch request.
 * @return {Object} An object containing the fetched data utilities and a function `dispatchGameEvent` for triggering game events.
 */
export function useGameFetch<S>()
{
    const { load, ...rest } = useFetch<{ event: GameEvent, payload: Record<string, any>}, S>(`/games/session/${window.game.identifier}/events`, {}, null);

    return {
        ...rest,
        dispatchGameEvent: load
    };
}
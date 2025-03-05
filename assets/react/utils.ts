import {UseBoundStore} from "zustand/react";
import {StoreApi} from "zustand/vanilla";
import {RefObject, useCallback, useEffect, useRef, useState} from "react";
import {toDashCase} from "@/scripts/utils";

type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
    _store: S,
) => {
    let store = _store as WithSelectors<typeof _store>
    store.use = {}
    for (let k of Object.keys(store.getState())) {
        ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
    }

    return store
}

/**
 * Custom hook to toggle between two states.
 *
 * @param {T} initialState - The initial state value.
 * @param {T|null} [finalState=null] - The final state value. If null, the hook will toggle between the initial state and its negation (cast to type T).
 * @return {[T, () => void]} - An array containing the current state and a function to toggle the state.
 */
// The toggle function here does not toggle the state at the first call!
export function useToggle<T>(initialState: T, finalState: T|null = null): [T, () => void]
{
    const [state, setState] = useState<T>(initialState);
    function toggleState() {
        setState(function (prevState) {
            return (prevState === initialState) ? (finalState ?? !initialState as T) : initialState;
        });
    }

    return [state, toggleState];
}

/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param {number} time - The time in milliseconds to wait before resolving the promise.
 * @return {Promise<void>} A promise that resolves after the specified delay.
 */

export function useDelay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time)
    });
}

/**
 * A custom hook for handling HTTP requests, providing state management for loading, errors, and a method for triggering the fetch operation.
 *
 * @param {string|URL} url The URL to which the HTTP request will be sent.
 * @param {Omit<RequestInit, 'body'>} [params={}] Optional configuration options for the HTTP request, excluding the body field.
 * @param {((data) => void)|null} [callback=null] An optional callback function to process the response data.
 * @return {{ loading: boolean, errors: any[], load: (data) => Promise<void> }} An object with the following properties:
 * - loading: A boolean that indicates whether the request is in progress.
 * - errors: An array containing any errors that occurred during the request.
 * - load: A function to initiate the fetch request, taking optional request body data as an argument.
 */

export function useFetch<T, S>(
    url: string|URL,
    params: Omit<RequestInit, 'body'> = {},
    callback: ((data: S) => void)|null = null
) {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any[]>([]);
    const paramsRef: RefObject<Omit<RequestInit, 'body'>> = useRef({
        method: 'POST',
        ...params,
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json',
            ...params.headers
        }
    });

    const load = useCallback(
        async function (data: T|null = null) {
            try {
                const response = await fetch(url, {
                    ...paramsRef.current,
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    setErrors(function (prevErrors) {
                        return [...prevErrors, response.statusText];
                    });
                    return;
                }
                if (callback) callback(await response.json());
            } catch (e) {
                setErrors(function (prevErrors) {
                    return [...prevErrors, e];
                });
            } finally {
                setLoading(false);
            }
        }, [url, callback]
    );

    return {
        loading,
        errors,
        load,
    }
}

/**
 * A custom hook that subscribes to an EventSource for server-sent events.
 * It listens to the messages from the provided URL and invokes the callback function
 * whenever a new event message is received.
 *
 * @param {string} url The URL to open an EventSource connection to.
 * @param {(data) => void} callback A function to be called with the parsed event data when a message is received.
 * @param {any[]} [deps=[]] An optional array of dependency values that will trigger the effect to reinitialize the EventSource when changed.
 * @return {void} Does not return any value.
 */
export function useEventSource<T>(
    url: string,
    callback: (data: T) => void,
    deps: any[] = []
) {
    useEffect(() => {
        const eventSource = new EventSource(JSON.parse(url));
        eventSource.onmessage = (event) => {
            callback(JSON.parse(event.data));
        }
        eventSource.onerror = (event) => {
            console.error(event);
        }
        return function () {
            return eventSource.close();
        }
    }, [url, ...deps]);
}

/**
 * Initializes a Stimulus controller with the provided name and values.
 *
 * @param {string} controller - The name of the Stimulus controller to initialize.
 * @param {Record<string, any>} [values={}] - A record of values to be passed to the controller.
 * @return {any} The result of the Stimulus controller initialization.
 */
export function stimulusController(controller: string, values: Record<string, any> = {}) {
   return stimulusControllers([controller], { [controller]: values });
}

/**
 * Generates data attributes for Stimulus controllers and their respective values.
 *
 * @param {string[]} controllers - An array of Stimulus controller names to include in the attributes.
 * @param {Record<string, Record<string, any>>} controllersValues - An object containing values for each controller,
 * where the keys are controller names and the values are objects defining key-value pairs for the controller's data attributes.
 * @return {Record<string, any>} An object containing the computed data attributes for Stimulus controllers and their associated values.
 */

export function stimulusControllers(controllers: string[], controllersValues: Record<string, Record<string, any>>) {
    const attributes: Record<string, any> = {};
    for (let controller of controllers) {
        if (attributes["data-controller"]) {
            attributes["data-controller"] += ` ${controller}`;
        } else {
            attributes["data-controller"] = controller;
        }

        for (let value in controllersValues[controller]) {
            const valueType = typeof controllersValues[controller][value];
            if (valueType === "string") {
                attributes[`data-${controller}-${toDashCase(value)}-value`] = controllersValues[controller][value];
                continue;
            }
            attributes[`data-${controller}-${toDashCase(value)}-value`] = JSON.stringify(controllersValues[controller][value]);
        }
    }

    return attributes;
}

/**
 * A custom hook for managing and manipulating array state providing functions to append, prepend, and remove items.
 *
 * @param {T[]} array - The initial array to be used as the state.
 * @return {Object} An object containing the current array state, a function to update the state, and utility functions:
 * - `state`: The current array state.
 * - `setState`: A function to update the array state directly.
 * - `append(item: T)`: A function to add an item to the end of the array.
 * - `prepend(item: T)`: A function to add an item to the beginning of the array.
 * - `remove(item: T)`: A function to remove the specified item from the array.
 */
export function useArrayState<T>(array: T[]) {
    const [state, setState] = useState<T[]>(array);

    return {
        state,
        setState,
        append: function (item: T) {
            setState([...state, item]);
        },
        prepend: function (item: T) {
            setState([item, ...state]);
        },
        remove: function (item: T) {
            setState(state.filter(function (value) {
                return value !== item;
            }));
        }
    }
}
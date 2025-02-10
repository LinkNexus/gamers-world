import {UseBoundStore} from "zustand/react";
import {StoreApi} from "zustand/vanilla";
import {RefObject, useCallback, useEffect, useRef, useState} from "react";

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

export function useDelay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time)
    });
}

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
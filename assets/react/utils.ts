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

export function useToggle<T>(initialState: T, finalState: T|null = null) {
    const [state, setState] = useState<T>(initialState);
    function toggleState() {
        setState(function (prevState) {
            return prevState === initialState ? (finalState ?? !initialState as T) : initialState;
        });
    }

    return {state, toggleState};
}

export function useDelay(time: number): Promise<void> {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time)
    });
}

export function useFetch<T> (
    url: string|URL,
    params: Omit<RequestInit, 'body'> = {},
    callback?: (data: T) => void
) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
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
        async function (data: any = null) {
            try {
                const response = await fetch(url, {...paramsRef.current, body: JSON.stringify(data) });
                if (!response.ok) {
                    setError(response.statusText);
                    return;
                }
                if (callback) callback(await response.json());
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }, [url, callback]
    );

    return {
        loading,
        error,
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
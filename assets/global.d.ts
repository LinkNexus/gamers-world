import {Player} from "@/react/Games/types";
import {GameDifficulty, GameName, GameType} from "@/react/Games/types/enums";
import Modal from "./scripts/custom-elements/Modal";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
    interface Window {
        game: {
            user: Omit<Omit<Player, 'status'>, 'previousStatus'>,
            initiator: string,
            urls: Record<"join"|"synchronization"|"isReady"|"disconnect"|"play", 'string'>,
            type: GameType,
            name: GameName,
            duration: number|null,
            difficulty: GameDifficulty|null,
            identifier: string,
        },
        FlowbiteInstances: any;
    }
}

declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            'clipboard-element': CustomElement<any>;
            'random-input': CustomElement<any>;
            'modal-element': CustomElement<any>;
            'modal-multiple-steps': CustomElement<any>;
            'breadcrumb-element': CustomElement<any>;
            'disabler-element': CustomElement<any>;
            'event-dispatcher': CustomElement<any>;
            'spinner-element': CustomElement<any>;
            'readt-component': CustomElement<any>;
            'fetch-element': CustomElement<any>;
        }
    }
}
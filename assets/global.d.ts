import {Player} from "@/react/Games/types";
import {GameDifficulty, GameName, GameType} from "@/react/Games/types/enums";
import Modal from "./scripts/custom-elements/Modal";
import Clipboard from "@/scripts/elements/Clipboard";
import MultiModal from "@/scripts/elements/modal/MultiModal";
import DisableButton from "@/scripts/elements/DisableButton";
import Spinner from "@/scripts/elements/Spinner";

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
            'clipboard-element': CustomElement<Clipboard>;
            'random-input': CustomElement<any>;
            'modal-element': CustomElement<Modal>;
            'modal-multiple-steps': CustomElement<MultiModal>;
            'breadcrumb-element': CustomElement<any>;
            'disable-button': CustomElement<DisableButton>;
            'event-dispatcher': CustomElement<any>;
            'spinner-element': CustomElement<Spinner>;
        }
    }
}
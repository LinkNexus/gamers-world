import {create} from "zustand/react";
import {Player} from "@/react/Games/types";
import {createSelectors} from "@/react/utils";
import {combine} from "zustand/middleware";
import {PlayerStatus} from "@/react/Games/types/enums";

declare global {
    interface Window {
        user: Player;
        gameInitiator: string;
    }
}

const useGameStore = createSelectors(
    create(
        combine(
            {
                user: window.user,
                opponent: null as Player|null,
                initiator: window.gameInitiator,
            },
            (set) => ({
                setOpponent: function (opponent: Player|null) {
                    set(function (state) {
                        return { ...state, opponent };
                    })
                },
                changeUserStatus: function (status: PlayerStatus) {
                    set(function (state) {
                        return { ...state, user: { ...state.user, status: status } }
                    })
                },
                changeOpponentStatus: function (status: PlayerStatus) {
                    set(function (state) {
                        return { ...state, opponent: state.opponent ? { ...state.opponent, status } : null }
                    })
                },
                kickOpponent: function () {
                    set(function (state) {
                        return { ...state, opponent: null, user: { ...state.user, status: PlayerStatus.WAITING } }
                    })
                }
            })
        )
    )
);

export default useGameStore;
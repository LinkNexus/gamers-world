import {create} from "zustand/react";
import {Player} from "@/react/Games/types";
import {createSelectors} from "@/react/utils";
import {combine} from "zustand/middleware";
import {PlayerStatus} from "@/react/Games/types/enums";

const defaultUser: Player = {
    identifier: '',
    username: '',
    image: '',
    status: PlayerStatus.WAITING
};

const useGameStore = createSelectors(
    create(
        combine(
            {
                user: defaultUser as Player,
                opponent: null as Player|null,
            },
            (set) => ({
                setUser: function (user: Player) {
                    set(function (state) {
                        if (state.user.identifier !== '')
                            return state;
                        return { ...state, user };
                    })
                },
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
                        if ([PlayerStatus.FOUND_OPPONENT, PlayerStatus.READY].includes(state.opponent?.status || PlayerStatus.WAITING)) {
                            return { ...state, opponent: null }
                        }

                        return state;
                    })
                }
            })
        )
    )
);

export default useGameStore;
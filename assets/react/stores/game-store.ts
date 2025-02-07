import {create} from "zustand/react";
import {Player} from "@/react/types";
import {createSelectors} from "@/react/utils";
import {combine} from "zustand/middleware";
import {PlayerStatus} from "@/react/types/enums";

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
                user: defaultUser,
                opponent: null as Player|null
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
                }
            })
        )
    )
);

export default useGameStore;
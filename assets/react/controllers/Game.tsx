import React from "react";
import WaitingQueue from "@/react/components/WaitingQueue";
import useStore from "@/react/store";
import {GameType} from "@/react/enums";
import Spinner from "@/react/components/utilities/Spinner";
import {User} from "@/react/types";

interface Props {
    userJson: string;
    gameType: GameType;
    gameName: string;
}

export default function ({ userJson, gameName, gameType }: Props) {
    useStore.getState().setUser(JSON.parse(userJson) as User);

    if (gameType === GameType.solo)
        return <Spinner />

    return <WaitingQueue />
}
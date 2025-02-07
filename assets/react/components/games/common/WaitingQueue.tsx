import React, {ReactElement} from "react";
import SplitScreen from "@/react/components/SplitScreen";
import type {User} from "@/react/types";
import Spinner from "@/react/components/utilities/Spinner";
import useStore from "@/react/store";

export default function (): ReactElement {
    const user = useStore.use.user(),
        opponent = useStore.use.opponent();

    const structure = Structure(user as User, opponent);
    return <SplitScreen structure={structure} />
}

const Structure = (user: User, opponent: User|null) => {
    return {
        playerSide: (
            <>
                <div className='image'>
                    <img src={`/images/users/${user.image}`} alt='profile-image'/>
                </div>
                <div className='header'>
                    <h1>
                        <span>Player:</span>
                        <span>{user.username}</span>
                    </h1>
                    <span className='opponent-state'>Opponent is ready!</span>
                </div>
            </>
        ),

        opponentSide: !opponent ? <Spinner /> : (
            <>
                <div className='image'>
                    <img src={`/images/${opponent.image}`} alt='profile-image'/>
                </div>
                <div className='header'>
                    <h1>
                        <span>Opponent:</span>
                        <span>{opponent.username}</span>
                    </h1>
                </div>
            </>
        )
    }
}
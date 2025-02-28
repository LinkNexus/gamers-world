import useGameStore from "@/react/Games/store";
import { SyntheticEvent } from "react";
import {stimulusController} from "@/react/utils";


export default function () {
    const setUsername = useGameStore.getState().setUsername;

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        setUsername(formData.get('username') as string);
    }

    return (
        <div
            {...stimulusController("modal--structure", {
                id: "player-name",
                initiallyVisible: true,
                title: "Enter a username",
                static: true,
                isCloseable: false,
            })}
        >
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-y-5 md:gap-x-3" data-controller="disable-button">
                <input name="username" placeholder="Username" className="w-full" data-disable-button-target="notEmpty" type="text" />
                <button className="button-primary" data-disable-button-target="button">Save</button>
            </form>
        </div>
    );
}
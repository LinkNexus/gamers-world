import Modal from "@/react/Utilities/Modal";
import useGameStore from "@/react/Games/store";
import { SyntheticEvent } from "react";


export default function ({ username }: { username: string|null }) {
    const setUsername = useGameStore.getState().setUsername;

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get('username') as string;

        setUsername(username);
    }

    return (
        /* <Modal id="enter-username" title="Enter Username" isStatic={true} initiallyVisible={true} isClosed={!!username}>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-y-5 md:gap-x-3" data-controller="disable-button">
                <input name="username" placeholder="Username" className="w-full" data-disable-button-target="notEmpty" type="text" />
                <button type="submit" className="button-primary" data-disable-button-target="button">Save</button>
            </form>
        </Modal> */

        <modal-element title="Enter Username" id="enter-username" static={true} initiallyVisible={true} isClosed={!!username}>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-y-5 md:gap-x-3" data-controller="disable-button">
                <input name="username" placeholder="Username" className="w-full" data-disable-button-target="notEmpty" type="text" />
                <button className="button-primary" data-disable-button-target="button">Save</button>
            </form>
        </modal-element>
    );
}
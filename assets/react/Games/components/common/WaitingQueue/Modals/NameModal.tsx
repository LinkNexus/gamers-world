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
        <modal-element title="Enter Username" id="enter-username-modal" static={true} initially-visible={true} isClosed={!!username}>
            <disable-button>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-y-5 md:gap-x-3">
                    <input name="username" placeholder="Username" className="w-full" data-targeted-as="disable-button:not-empty" type="text" />
                    <button className="button-primary" data-targeted-as="disable-button:button">Save</button>
                </form>
            </disable-button>
        </modal-element>
    );
}
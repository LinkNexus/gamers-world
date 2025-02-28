import {stimulusController} from "@/react/utils";

export default function () {
    return (
        <div
            {...stimulusController("modal--structure", {
                id: "invite-friend",
                initiallyVisible: true,
                title: "Invite a friend",
            })}
        >
            <div
                {...stimulusController("clipboard", {
                    id: "copy-link",
                    label: "Share this link to your friend in order to invite them to the game",
                    isLink: true,
                })}
            >
            </div>
        </div>
    );
}
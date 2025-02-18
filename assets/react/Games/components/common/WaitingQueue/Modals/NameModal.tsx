import Modal from "@/react/Utilities/Modal";
import {RefObject, useEffect, useRef} from "react";


export default function () {

    const ref: RefObject<HTMLFormElement | null> = useRef(null);
    const inputRef: RefObject<HTMLInputElement | null> = useRef(null);

    useEffect(function () {
        ref.current?.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted');
        });

        inputRef.current?.addEventListener('input', function () {
            console.log('Input changed');
        });
    }, []);

    return (
        /* <div 
            data-controller="modals--render"
            data-modals--render-id-value="enter-username"
            data-modals--render-initially-visible-value="true"
            data-modals--render-title-value="Enter Username"
            data-modals--render-static-value="true"
        >
            <div className="flex flex-col md:flex-row gap-y-5 md:gap-x-3" data-controller="disable-button">
                <input placeholder="Username" className="w-full" data-disable-button-target="notEmpty" type="text" />
                <button className="button-primary" data-disable-button-target="button">Save</button>
            </div>
        </div> */

        <Modal id="enter-username" title="Enter Username" isStatic={true} initiallyVisible={true}>
            <form data-turbo="false" ref={ref} className="flex flex-col md:flex-row gap-y-5 md:gap-x-3" data-controller="disable-button">
                <input ref={inputRef} placeholder="Username" className="w-full" data-disable-button-target="notEmpty" type="text" />
                <button type="submit" className="button-primary" data-disable-button-target="button">Save</button>
            </form>
        </Modal>
    );
}
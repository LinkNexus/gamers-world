import EventDispatcherController from "@/controllers/event_dispatcher_controller";

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends EventDispatcherController {
    static values = {
        eventMaps: Array,
        target: String,
        action: {
            default: "open",
            type: String,
        },
    }

    declare targetValue: string;
    declare actionValue: "open" | "close" | "toggle";

    connect() {
        this.eventMapsValue = [{
            event: `modal:${this.actionValue}`,
            target: `#${this.targetValue}-modal`,
            trigger: "click",
        }];
        super.connect();
    }
}

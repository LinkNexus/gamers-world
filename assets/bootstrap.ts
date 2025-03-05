import {registerControllers, startStimulusApp} from "vite-plugin-symfony/stimulus/helpers";

const app = startStimulusApp();

registerControllers(
    app,
    // @ts-ignore
    import.meta.glob<StimulusControllerInfosImport>(
        "./controllers/**/*_controller.ts",
        {
            query: "?stimulus",
            /**
             * always true, the `lazy` behavior is managed internally with
             * import.meta.stimulusFetch (see reference)
             */
            eager: true,
        },
    ),
);
// register any custom, 3rd party controllers here
// app.register('some_controller_name', SomeImportedController);

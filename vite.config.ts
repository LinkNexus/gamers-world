import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

/* if you're using React */
import react from '@vitejs/plugin-react';
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";

export default defineConfig({
    plugins: [
        react(), // if you're using React
        symfonyPlugin({
            stimulus: true
        }),
        tailwindcss()
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/entrypoints/app.ts",
                base: "./assets/entrypoints/base.ts",
                auth: "./assets/entrypoints/auth.ts",
            },
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "assets/")
        }
    }
});

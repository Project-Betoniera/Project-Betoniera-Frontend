import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";
import "dotenv/config";

const preset = minimal2023Preset;

export default defineConfig({
    preset: preset,
    // PWA icons will be generated from this file
    images: [
        process.env.IS_BETA_BUILD === "true" ? "public/icons/logo_beta.svg" : "public/icons/logo_release.svg",
    ],
});

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import "dotenv/config";

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL environment variable is not set");
}
// Validates URL
new URL(apiUrl);

const plausibleDomain = process.env.PLAUSIBLE_DOMAIN || null;
const plausibleScript = process.env.PLAUSIBLE_SCRIPT || "https://plausible.io/js/plausible.js";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(apiUrl),
    __PLAUSIBLE_DOMAIN__: JSON.stringify(plausibleDomain),
    __PLAUSIBLE_SCRIPT__: JSON.stringify(plausibleScript),
  },
  plugins: [react(), VitePWA({
    registerType: "autoUpdate", devOptions: { enabled: true }, manifest: {
      prefer_related_applications: true,
      name: "Calendar Exporter",
      short_name: "Calendar Exporter",
      description: "Calendar Exporter",
      theme_color: "#0F6CBD",
      start_url: "/?utm_source=pwa&utm_medium=start_url",
      id: "/",
      scope: "/",
      protocol_handlers: [
        {
          protocol: "web+betoniera",
          url: "/?protocol=%s&utm_source=pwa&utm_medium=protocol"
        }
      ],
      related_applications: [
        {
          id: "org.betoniera.app",
          platform: "webapp",
          url: "http://betoniera.org/manifest.webmanifest"
        }
      ],
      display: "standalone",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png"
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png}"]
    }
  })],
});

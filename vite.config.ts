import react from "@vitejs/plugin-react";
import "dotenv/config";
import { exec } from "node:child_process";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not set");
  }
  // Validates URL
  new URL(apiUrl);

  const plausibleDomain = process.env.PLAUSIBLE_DOMAIN || null;
  const plausibleScript = process.env.PLAUSIBLE_SCRIPT || "https://plausible.io/js/plausible.js";
  const isBetaBuild = process.env.IS_BETA_BUILD === "true";
  const commitShaDisplay = await new Promise((resolve, reject) => {
    exec('git describe --always --abbrev=7 "--dirty=*" "--broken=!!" --exclude *', (err, stdout) => {
      if (err) reject(err);
      resolve(stdout.trim());
    });
  }).catch((err) => {
    console.warn("Failed to get git information", err);
    return null;
  });
  const commitSha = await new Promise((resolve, reject) => {
    exec("git describe --always --abbrev=0 --exclude *", (err, stdout) => {
      if (err) reject(err);
      resolve(stdout.trim());
    });
  }).catch((err) => {
    console.warn("Failed to get git information", err);
    return null;
  });

  return {
    define: {
      __API_URL__: JSON.stringify(apiUrl),
      __PLAUSIBLE_DOMAIN__: JSON.stringify(plausibleDomain),
      __PLAUSIBLE_SCRIPT__: JSON.stringify(plausibleScript),
      __IS_BETA_BUILD__: isBetaBuild,
      __COMMIT_SHA_DISPLAY__: JSON.stringify(commitShaDisplay),
      __COMMIT_SHA__: JSON.stringify(commitSha),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt",
        devOptions: { enabled: true },
        manifest: {
          prefer_related_applications: true,
          name: "Project Betoniera",
          short_name: "Project Betoniera",
          description: "Project Betoniera",
          theme_color: "#0F6CBD",
          start_url: "/?utm_source=pwa&utm_medium=start_url",
          id: "/",
          scope: "/",
          protocol_handlers: [
            {
              protocol: "web+betoniera",
              url: "/?protocol=%s&utm_source=pwa&utm_medium=protocol",
            },
          ],
          related_applications: [
            {
              id: "/",
              platform: "webapp",
              url: "http://betoniera.org/manifest.webmanifest",
            },
          ],
          display: "standalone",
          icons: [
            {
              src: "icons/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icons/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png}"],
        },
      }),
    ],
  };
});

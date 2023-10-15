import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error('API_URL environment variable is not set');
}
// Validates URL
new URL(apiUrl);

const plausibleDomain = process.env.PLAUSIBLE_DOMAIN || null;
const plausibleScript = process.env.PLAUSIBLE_SCRIPT || 'https://plausible.io/js/plausible.js';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(apiUrl),
    __PLAUSIBLE_DOMAIN__: JSON.stringify(plausibleDomain),
    __PLAUSIBLE_SCRIPT__: JSON.stringify(plausibleScript),
  },
  plugins: [react(), VitePWA({ registerType: 'autoUpdate', devOptions: { enabled: true }, manifest: {
    name: 'Calendar App',
    short_name: 'Calendar App',
    theme_color: 'black',
    icons: [
      {
        src: '/src/assets/logo.svg',
        sizes: "192x192",
        type: "image/svg+xml"
      }
    ]
  } })],
})

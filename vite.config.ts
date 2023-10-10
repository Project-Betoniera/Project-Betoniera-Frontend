import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const plausibleDomain = process.env.PLAUSIBLE_DOMAIN || null;
const plausibleScript = process.env.PLAUSIBLE_SCRIPT || 'https://plausible.io/js/plausible.js';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __PLAUSIBLE_DOMAIN__: JSON.stringify(plausibleDomain),
    __PLAUSIBLE_SCRIPT__: JSON.stringify(plausibleScript),
  },
  plugins: [react()],
})

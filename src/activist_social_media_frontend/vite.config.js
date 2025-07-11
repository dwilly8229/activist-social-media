// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK),
      CANISTER_ID_ACTIVIST_SOCIAL_MEDIA_BACKEND: JSON.stringify(
        process.env.CANISTER_ID_ACTIVIST_SOCIAL_MEDIA_BACKEND || "uxrrr-q7777-77774-qaaaq-cai"
      ),
    },
    global: 'window'
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'window' }
    }
  }
})

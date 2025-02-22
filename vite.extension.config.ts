import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserExtension from 'vite-plugin-web-extension'
import tsPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  plugins: [
    react(),
    tsPaths(),
    browserExtension({
      manifest: './src/extension/manifest.json',
      browser: 'chrome',
      webExtConfig: {
        startUrl: 'https://vercel.com/home',
        target: 'chromium',
      },
    }),
  ],
})

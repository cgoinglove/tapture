import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserExtension from 'vite-plugin-web-extension'
import { resolve } from 'node:path'
import pathConfig from './vite.path.config'

// https://vite.dev/config/
export default defineConfig(
  mergeConfig(pathConfig, {
    build: {
      outDir: resolve(__dirname, 'dist/extension'),
      emptyOutDir: true,
    },
    plugins: [
      react(),
      browserExtension({
        manifest: './src/extension/manifest.json',
        browser: 'chrome',
        webExtConfig: {
          startUrl: 'https://vercel.com/home',
          target: 'chromium',
        },
      }),
    ],
  }),
)

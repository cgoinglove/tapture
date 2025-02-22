import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import pathConfig from './vite.path.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(
  mergeConfig(pathConfig, {
    build: {
      outDir: resolve(__dirname, 'dist/docs'),
    },
    root: __dirname,
    plugins: [react()],
  }),
)

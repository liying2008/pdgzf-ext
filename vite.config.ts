import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' assert { type: 'json' }

export const r = (...args: string[]) => resolve(__dirname, '..', ...args)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  plugins: [
    vue(),
    crx({ manifest }),
  ]
})

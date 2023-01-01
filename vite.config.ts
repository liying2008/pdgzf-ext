import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import manifest from './src/manifest'
import { r } from './scripts/utils'

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
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [
            ['*', 'browser'],
          ],
        },
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dirs: [r('src/components')],
      // generate `components.d.ts` for ts support with Volar
      dts: r('src/components.d.ts'),
      resolvers: [NaiveUiResolver()],
    }),
  ],
})

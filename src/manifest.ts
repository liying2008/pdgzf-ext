import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export default defineManifest({
  name: '浦东公租房扩展',
  short_name: '浦东公租房扩展',
  version: pkg.version,
  description: '浦东公租房选房',
  author: 'LiYing',
  manifest_version: 3,
  homepage_url: 'https://github.com/liying2008/pdgzf-ext',
  minimum_chrome_version: '55',
  action: {
    browser_style: false,
    default_popup: 'popup.html',
  },
  options_ui: {
    page: 'options.html',
    open_in_tab: true,
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  permissions: [
    'storage',
    'notifications',
    'tabs',
    'downloads',
  ],
  host_permissions: [
    'https://select.pdgzf.com/*',
  ],
  content_scripts: [{
    matches: [
      'https://select.pdgzf.com/*',
    ],
    js: ['src/content/index.ts'],
    run_at: 'document_end',
  }],
  web_accessible_resources: [
    {
      resources: ['css/style.css'],
      matches: ['https://select.pdgzf.com/*'],
    },
  ],
})

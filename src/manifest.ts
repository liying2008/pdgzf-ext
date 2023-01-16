import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export function getManifest(mode: string) {
  const productionMode = mode === 'production'
  let envTag = ''
  let envImgDir = 'img'
  if (!productionMode) {
    envTag = '（开发模式）'
    envImgDir = 'img/dev'
  }

  return defineManifest({
    name: `浦东公租房扩展${envTag}`,
    short_name: `浦东公租房扩展${envTag}`,
    version: pkg.version,
    description: `浦东公租房选房${envTag}`,
    author: 'LiYing',
    manifest_version: 3,
    homepage_url: 'https://github.com/liying2008/pdgzf-ext',
    minimum_chrome_version: '87',
    icons: {
      16: `${envImgDir}/logo_16.png`,
      32: `${envImgDir}/logo_32.png`,
      48: `${envImgDir}/logo_48.png`,
      128: `${envImgDir}/logo_128.png`,
    },
    action: {
      browser_style: false,
      default_popup: 'popup.html',
      default_icon: {
        19: `${envImgDir}/logo_19.png`,
        38: `${envImgDir}/logo_38.png`,
      },
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
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\';',
      sandbox: 'sandbox allow-scripts allow-forms allow-popups allow-modals; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; child-src \'self\';',
    },
    sandbox: {
      pages: [
        'action.html',
      ],
    },
  })
}

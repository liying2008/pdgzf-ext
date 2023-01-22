import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  const contentSecurityPolicyUrls = [
    'https://webapi.amap.com',
    'http://webapi.amap.com',
    'https://restapi.amap.com',
    'https://requirejs.org',
  ]

  let envTag = ''
  let envImgDir = 'img'
  if (isDev) {
    envTag = '（开发模式）'
    envImgDir = 'img/dev'
  }

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: `浦东公租房扩展${envTag}`,
    short_name: `浦东公租房扩展${envTag}`,
    version: pkg.version,
    description: `浦东公租房选房${envTag}`,
    author: 'LiYing',
    homepage_url: 'https://github.com/liying2008/pdgzf-ext',
    minimum_chrome_version: '87',
    browser_action: {
      default_icon: {
        19: `${envImgDir}/logo_19.png`,
        38: `${envImgDir}/logo_38.png`,
      },
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: './dist/background/index.html',
      persistent: false,
    },
    icons: {
      16: `${envImgDir}/logo_16.png`,
      32: `${envImgDir}/logo_32.png`,
      48: `${envImgDir}/logo_48.png`,
      128: `${envImgDir}/logo_128.png`,
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'https://select.pdgzf.com/*',
      'https://webapi.amap.com/*',
    ],
    content_scripts: [{
      matches: [
        'https://select.pdgzf.com/*',
      ],
      js: ['./dist/contentScripts/index.global.js'],
      run_at: 'document_end',
    }],
    web_accessible_resources: [
      'css/style.css',
    ],
    content_security_policy: `script-src 'self' 'unsafe-eval'; script-src-elem 'self' ${contentSecurityPolicyUrls.join(' ')}; object-src 'self'`,
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; script-src-elem 'self' https://localhost:${port} ${contentSecurityPolicyUrls.join(' ')}; object-src 'self'`
  }

  return manifest
}

import { inject as injectProjectListFunctions } from './projects-list-functions-injector'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // console.info('[vitesse-webext] Hello world from content script')

  // 注入小区列表页面功能
  injectProjectListFunctions()
})()

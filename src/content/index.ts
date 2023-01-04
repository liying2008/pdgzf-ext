import { inject as injectProjectListFunctions } from './projects-list-functions-injector'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // capture the location at page load
  let currentLocation = document.location.href

  function listnerUrlChange() {
    const observer = new MutationObserver(() => {
      if (currentLocation !== document.location.href) {
        currentLocation = document.location.href
        console.log('location changed!')
        injectFunctions()
      }
    })

    const mainContainer = document.getElementById('app')
    if (mainContainer) {
      observer.observe(mainContainer, {
        childList: true,
        // important for performance
        subtree: true,
      })
    }
  }

  function injectFunctions() {
  // 注入小区列表页面功能
    injectProjectListFunctions()
  }
  // 注入功能
  injectFunctions()
  // 监听 URL 变化
  listnerUrlChange()
})()

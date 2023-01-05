import { inject as injectProjectListFunctions } from './projects-list-functions-injector'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // capture the location at page load
  let currentLocation = document.location.href
  let currentPage = '1'

  function watchPageChange() {
    const observer = new MutationObserver(() => {
      if (currentLocation !== document.location.href) {
        currentLocation = document.location.href
        console.log('location changed!')
        injectFunctions()
      } else {
        const page = getCurrentPage()
        if (currentPage !== page) {
          currentPage = page
          console.log('page changed!')
          injectFunctions()
        }
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

  function getCurrentPage() {
    const pagerElem = document.querySelector('div#app ul.el-pager')
    if (pagerElem) {
      const activeLi = pagerElem.querySelector('li.active')
      return activeLi?.textContent || ''
    } else {
      return ''
    }
  }

  function injectFunctions() {
  // 注入小区列表页面功能
    injectProjectListFunctions()
  }
  // 注入功能
  injectFunctions()

  // 监听页面变化
  watchPageChange()
})()

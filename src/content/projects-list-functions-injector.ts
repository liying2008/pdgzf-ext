import browser from 'webextension-polyfill'
import type { ContentResp, ProjectProperty } from '~/models'
import { CMD_GET_PROJECT_PROPERTIES, ContentMessage } from '~/models'

export function inject() {
  const message = new ContentMessage(CMD_GET_PROJECT_PROPERTIES)

  browser.runtime.sendMessage(message).then((resp: ContentResp<ProjectProperty[]>) => {
  // console.log('content-script::resp', resp)
    if (resp.status !== 'ok') {
      console.log('获取 ProjectProperty 失败！')
      return
    }

    const data = resp.data!
    console.log('data', data)
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        console.log('页面加载完毕')
        enable()
      }
    }
  })
}

function enable() {
  const listElem = isProjectsListPage()
  if (!listElem) {
    return
  }
  console.log(listElem)
}

function isProjectsListPage() {
  const selector = 'div.village-house-wrap ul.village-house-lists'
  const element = document.querySelector(selector)
  console.log('isProjectsListPage', element)
  return element
}

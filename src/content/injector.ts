import browser from 'webextension-polyfill'
import { enableProjectsListFunctions } from './projects-list-functions-injector'
import { enableHouseDetailFunctions } from './house-detail-functions-injector'
import type { ContentResp, ProjectProperty, ProjectPropertyValues } from '~/models'
import { CMD_GET_PPV, CMD_GET_PROJECT_PROPERTIES, ContentMessage } from '~/models'

export function inject() {
  // 获取 project properties
  browser.runtime.sendMessage(new ContentMessage(CMD_GET_PROJECT_PROPERTIES)).then((resp: ContentResp<ProjectProperty[]>) => {
  // console.log('content-script::resp', resp)
    if (resp.status !== 'ok') {
      console.log('获取 ProjectProperty 失败！')
      return
    }

    const projectProperties = resp.data!
    console.log('projectProperties', projectProperties)

    // 获取 ppv
    browser.runtime.sendMessage(new ContentMessage(CMD_GET_PPV)).then((resp: ContentResp<ProjectPropertyValues>) => {
      // console.log('content-script::resp', resp)
      if (resp.status !== 'ok') {
        console.log('获取 ProjectPropertyValues 失败！')
      }

      const ppv = resp.data!
      console.log('ppv', ppv)
      // 注入功能
      enableProjectsListFunctions(projectProperties, ppv)
      enableHouseDetailFunctions(projectProperties, ppv)
    })
  })
}

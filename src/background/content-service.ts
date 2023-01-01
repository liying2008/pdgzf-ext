import browser from 'webextension-polyfill'
import type { StorageChangeWrapper } from '~/libs/storage'
import { StorageService } from '~/libs/storage'
import { CMD_GET_PROJECT_PROPERTIES, ContentResp, Options } from '~/models'

export class ContentService {
  private static options = Options.default()

  static start() {
    StorageService.getOptions().then((options) => {
      ContentService.options = options
    })
    // 添加 options 变动监听
    StorageService.addStorageListener(ContentService.storageChange)


    // 处理来自 content_scripts 的消息
    browser.runtime.onMessage.addListener(async (message, sender) => {
      // console.log('message', message)
      // console.log('sender', sender)
      // NOTE: Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage) Error
      const cmd = message.cmd
      switch (cmd) {
        case CMD_GET_PROJECT_PROPERTIES:
          return Promise.resolve((ContentResp.fromObj({
            status: 'ok',
            data: ContentService.options.projectProperties,
          })))
        default:
          break
      }
    })
  }

  private static storageChange(changes: StorageChangeWrapper) {
    if (StorageService.keyForOptions in changes) {
      // 设置有改变
      // console.log('changes', changes)
      ContentService.options = changes[StorageService.keyForOptions].newValue
    }
  }
}

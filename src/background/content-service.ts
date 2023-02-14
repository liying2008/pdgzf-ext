import browser from 'webextension-polyfill'
import type { StorageChangeWrapper } from '~/libs/storage'
import { StorageService } from '~/libs/storage'
import { CMD_GET_PPV, CMD_GET_PROJECT_PROPERTIES, CMD_SET_PPV, ContentResp } from '~/models/content-message'
import { Options } from '~/models/options'
import type { ProjectPropertyValues } from '~/models/property-value'

export class ContentService {
  private static options = Options.default()
  private static ppv: ProjectPropertyValues = {}

  static start() {
    StorageService.getOptions().then((options) => {
      ContentService.options = options
    })

    StorageService.getPPV().then((ppv) => {
      ContentService.ppv = ppv
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
        case CMD_GET_PPV:
          return Promise.resolve((ContentResp.fromObj({
            status: 'ok',
            data: ContentService.ppv,
          })))
        case CMD_SET_PPV:
          try {
            const newPPV = await StorageService.savePartialPPV(message.data)
            // ContentService.ppv = newPPV
            return Promise.resolve((ContentResp.fromObj({
              status: 'ok',
              data: newPPV,
            })))
          } catch (e) {
            console.error(e)
            return Promise.resolve((ContentResp.fromObj({
              status: 'error',
              data: null,
            })))
          }
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
    if (StorageService.keyForPPV in changes) {
      // PPV 有改变
      // console.log('changes', changes)
      ContentService.ppv = changes[StorageService.keyForPPV].newValue
    }
  }
}

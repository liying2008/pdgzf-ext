import type { ProjectPropertyValues } from '~/models'
import { Options } from '~/models'

export interface StorageChange<T> {
  oldValue?: T
  newValue?: T
}

// [key: string]: StorageChange<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageChangeWrapper<T = any> = Record<string, StorageChange<T>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageChangeListener<T = any> = (changes: StorageChangeWrapper<T>, areaName: string) => void

export class StorageService {
  static readonly keyForOptions = 'options'
  static readonly keyForPPV = 'ppv'

  static addStorageListener(listener: StorageChangeListener) {
    if (!browser.storage.onChanged.hasListener(listener)) {
      // console.log('addStorageListener::listener', listener)
      browser.storage.onChanged.addListener(listener)
    }
  }

  static removeStorageListener(listener: StorageChangeListener) {
    if (browser.storage.onChanged.hasListener(listener)) {
      // console.log('removeStorageListener::listener', listener)
      browser.storage.onChanged.removeListener(listener)
    }
  }

  static async getOptions(): Promise<Options> {
    const result = await browser.storage.local.get(StorageService.keyForOptions)
    const partialOptions = result[StorageService.keyForOptions] || {}
    const options = Options.normalize(partialOptions)
    return Options.normalize(options)
  }

  static async saveOptions(options: Options) {
    let reason: Error | undefined

    try {
      const str = JSON.stringify(options)
      await browser.storage.local.set({
        [StorageService.keyForOptions]: JSON.parse(str),
      })
    } catch (e) {
      console.log(e)
      reason = e as Error
    }
    return new Promise<void>((resolve, reject) => {
      if (reason !== undefined) {
        reject(reason)
      } else {
        resolve()
      }
    })
  }

  static async savePartialOptions(partialOptions: Partial<Options>) {
    const oldOptions = await StorageService.getOptions()
    const newOptions = Options.update(partialOptions, oldOptions)
    // console.log('savePartialOptions', newOptions)
    return StorageService.saveOptions(newOptions)
  }

  static async getPPV(): Promise<ProjectPropertyValues> {
    const result = await browser.storage.local.get(StorageService.keyForPPV)
    return result[StorageService.keyForPPV] || {}
  }

  static async savePartialPPV(ppv: ProjectPropertyValues) {
    const oldPPV = await StorageService.getPPV()
    for (const project in ppv) {
      if (oldPPV[project] === undefined || oldPPV[project] == null) {
        oldPPV[project] = {}
      }
      for (const property in ppv[project]) {
        oldPPV[project][property] = ppv[project][property]
      }
    }
    let reason: Error | undefined

    try {
      const str = JSON.stringify(oldPPV)
      await browser.storage.local.set({
        [StorageService.keyForPPV]: JSON.parse(str),
      })
    } catch (e) {
      console.log(e)
      reason = e as Error
    }
    return new Promise<ProjectPropertyValues>((resolve, reject) => {
      if (reason !== undefined) {
        reject(reason)
      } else {
        resolve(oldPPV)
      }
    })
  }
}

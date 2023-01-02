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
        options: JSON.parse(str),
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

  static async setPPV(ppv: ProjectPropertyValues) {
    let reason: Error | undefined

    try {
      const str = JSON.stringify(ppv)
      await browser.storage.local.set({
        ppv: JSON.parse(str),
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
}

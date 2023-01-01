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

  static async getOptions(): Promise<Options> {
    const result = await browser.storage.local.get(StorageService.keyForOptions)
    const partialOptions = result.options || {}
    const options = Options.normalize(partialOptions)
    return Options.normalize(options)
  }

  static async saveOptions(options: Options) {
    let reason: Error | undefined

    try {
      const optionsStr = JSON.stringify(options)
      await browser.storage.local.set({
        options: JSON.parse(optionsStr),
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
}

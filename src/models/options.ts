import type { MapVendor } from './map-auth-code'
import { MapAuthCode } from './map-auth-code'
import type { ProjectProperty } from './project-property'

export class Options {
  projectProperties: ProjectProperty[] = []
  mapAuthCode: Record<MapVendor, MapAuthCode> = {
    amap: new MapAuthCode(),
    baidu: new MapAuthCode(),
  }

  static default(): Options {
    return new Options()
  }

  /**
   * 标准化配置项
   * @param options 部分配置项
   * @param ref 参考配置项
   * @returns 标准化后的配置项
   */
  static normalize(options: Partial<Options>, ref?: Options): Options {
    let refOptions: Options
    if (ref) {
      refOptions = ref
    } else {
      refOptions = Options.default()
    }

    if (options.projectProperties === undefined || options.projectProperties === null) {
      options.projectProperties = refOptions.projectProperties
    }
    if (options.mapAuthCode === undefined || options.mapAuthCode === null) {
      options.mapAuthCode = refOptions.mapAuthCode
    }
    return options as Options
  }

  /**
   * 更新配置项
   * @param newOptions 新的配置项
   * @param oldOptions 原始配置项
   * @returns 更新后的配置项
   */
  static update(newOptions: Partial<Options>, oldOptions: Options): Options {
    return Options.normalize(newOptions, oldOptions)
  }
}

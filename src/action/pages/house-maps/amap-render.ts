import AMapLoader from '@amap/amap-jsapi-loader'
import type AMapNamespace from '@amap/amap-jsapi-types'
import type { MapAuthCode } from '~/models'

export type AMap = typeof AMapNamespace


function onAutoComplete(autoCompletePlugin: any, keyword: string) {
  autoCompletePlugin.search(keyword, (status: any, result: any) => {
    // 搜索成功时，result即是对应的匹配数据
    console.log(status, result)
  })
}

function loadPlugins(amap: AMap.NameSpace | any, map: AMap.Map) {
  amap.plugin([
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.Geolocation',
    'AMap.AutoComplete',
    'AMap.RangingTool',
  ], () => { // 异步同时加载多个插件
    const scale = new amap.Scale()
    const toolbar = new amap.ToolBar()
    const geolocation = new amap.Geolocation()
    const autoComplete = new amap.AutoComplete({
      city: '上海',
    })

    const rangingTool = new amap.RangingTool(map)
    map.addControl(scale)
    map.addControl(toolbar)
    map.addControl(geolocation)
    // map.addControl(autoComplete)
    // map.addControl(rangingTool)
  })
}

export function render(mapAuthCode: MapAuthCode) {
  let map: any | null = null
  window._AMapSecurityConfig = {
    securityJsCode: mapAuthCode.secret!,
  }

  AMapLoader.load({
    key: mapAuthCode.key!, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    AMapUI: { // 是否加载 AMapUI，缺省不加载
      version: '1.1', // AMapUI 版本
      plugins: [
        'overlay/SimpleMarker',
      ], // 需要加载的 AMapUI ui插件
    },
    Loca: { // 是否加载 Loca， 缺省不加载
      version: '2.0', // Loca 版本
    },
  }).then((AMap) => {
    map = new AMap.Map('container', {
      center: [116.45, 39.92],
      layers: [// 使用多个图层
        new AMap.TileLayer.RoadNet(),
        // new AMap.TileLayer.Traffic({
        //   zIndex: 10,
        // }),
      ],
      zoom: 10,
    })
    loadPlugins(AMap, map!)
  }).catch((e) => {
    console.error(e) // 加载错误提示
  })
}

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { computed, watch } from 'vue'
import type { MapAuthCode, ProjectProperty, ProjectPropertyValues } from '~/models'
import type { Project } from '~/models/project'

interface Props {
  isReady: boolean
  mapAuthCode: MapAuthCode
  projects: Project[]
  projectProperties: ProjectProperty[]
  ppv: ProjectPropertyValues
}

const props = defineProps<Props>()

const mapCenter = computed(() => {
  let totalLng = 0
  let totalLat = 0
  props.projects.forEach((project) => {
    totalLng += project.longitude
    totalLat += project.latitude
  })
  return [totalLng / props.projects.length, totalLat / props.projects.length]
})

watch(() => props.isReady, (newVal) => {
  if (newVal) {
    console.log('projects', props.projects)
    console.log('ppv', props.ppv)
    render()
  }
})


function onAutoComplete(autoCompletePlugin: any, keyword: string) {
  autoCompletePlugin.search(keyword, (status: any, result: any) => {
    // 搜索成功时，result即是对应的匹配数据
    console.log(status, result)
  })
}

function loadPlugins(AMap: any, map: any) {
  AMap.plugin([
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.Geolocation',
    'AMap.AutoComplete',
    'AMap.RangingTool',
  ], () => { // 异步同时加载多个插件
    const scale = new AMap.Scale()
    const toolbar = new AMap.ToolBar()
    const geolocation = new AMap.Geolocation({
      offset: [20, 88],
    })
    const autoComplete = new AMap.AutoComplete({
      city: '上海',
    })

    const rangingTool = new AMap.RangingTool(map)
    map.addControl(scale)
    map.addControl(toolbar)
    map.addControl(geolocation)
    // map.addControl(autoComplete)
    // map.addControl(rangingTool)
  })
}

function getPropertyName(propertyId: string) {
  return props.projectProperties.find((item) => item.id === propertyId)?.name || '<未知属性>'
}

function getMarkerLabel(project: Project) {
  const name = project.name
  const ppv = props.ppv[name]
  let infoStr = ''
  if (ppv) {
    for (const key in ppv) {
      infoStr += `${getPropertyName(key)}：${ppv[key]}<br>`
    }
  }
  return `${name}<br>房源数：${project.rentableCount}<br>${infoStr}`
}

function addMarker(AMap: any, map: any) {
  props.projects.forEach((project) => {
    const marker = new AMap.Marker({
      position: [project.longitude, project.latitude],
      icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      anchor: 'bottom-center',
      offset: new AMap.Pixel(0, 0),
    })
    map.add(marker)
    const markerText = getMarkerLabel(project)
    // 设置鼠标划过点标记显示的文字提示
    marker.setTitle(markerText.replaceAll('<br>', '\n'))

    // 设置label标签
    // label默认蓝框白底左上角显示，样式className为：amap-marker-label
    marker.setLabel({
      direction: 'right',
      offset: new AMap.Pixel(10, 0), // 设置文本标注偏移量
      content: `<div class="marker-text info">${markerText}</div>`, // 设置文本标注内容
    })
  })
}

function render() {
  let map: any | null = null
  window._AMapSecurityConfig = {
    securityJsCode: props.mapAuthCode.secret!,
  }

  AMapLoader.load({
    key: props.mapAuthCode.key!, // 申请好的Web端开发者Key，首次调用 load 时必填
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
      center: mapCenter.value,
      layers: [// 使用多个图层
        new AMap.TileLayer.RoadNet(),
        // new AMap.TileLayer.Traffic({
        //   zIndex: 10,
        // }),
      ],
      zoom: 12,
    })
    loadPlugins(AMap, map!)
    addMarker(AMap, map)
  }).catch((e) => {
    console.error(e) // 加载错误提示
  })
}
</script>

<template>
  <div class="amap-render-wrapper">
    <div id="container"></div>
  </div>
</template>

<style scoped lang="scss">
.amap-render-wrapper {
  height: 100%;

  :deep(#container) {
    width: 100%;
    height: 100%;

    .amap-icon img {
      width: 25px;
      height: 34px;
    }

    .amap-marker-label {
      background-color: transparent;
      border: 0;
    }

    .marker-text {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: auto;
      padding: 0.6rem 1rem;
      margin-bottom: 1rem;
      background-color: white;
      border-width: 0;
      border-radius: 0.25rem;
      box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
    }

    .info {
      position: relative;
      top: 0;
      right: 0;
      min-width: 0;
      margin: 0;
    }
  }
}
</style>

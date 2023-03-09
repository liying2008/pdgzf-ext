<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { computed, reactive, ref, watch } from 'vue'
import { FullscreenExitOutlined, FullscreenOutlined } from '@vicons/material'
import StarLocationModal from '../components/StarLocationModal.vue'
import { LngLat } from './models'
import type { Project } from '~/models/project'
import type { MapAuthCode } from '~/models/map-auth-code'
import type { ProjectProperty } from '~/models/project-property'
import type { ProjectPropertyValues } from '~/models/property-value'
import { MapLocation } from '~/models/map-location'

interface Props {
  isReady: boolean
  mapAuthCode: MapAuthCode
  projects: Project[]
  projectProperties: ProjectProperty[]
  ppv: ProjectPropertyValues
  starLocations: MapLocation[]
}

const props = defineProps<Props>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'addStarLocation', location: MapLocation): void
}>()


const _amap = ref()
const _map = ref()

const contextMenuPositon = ref(new LngLat())
// 临时标记点数量
const tempMarkerCount = ref(0)
// 当前是否处于全屏模式
const isFullScreen = ref(false)
const mapContainerRef = ref<HTMLElement | null>(null)

const poiMarkerBlueUrl = browser.runtime.getURL('img/poi-marker-blue.png')
const poiMarkerRedUrl = browser.runtime.getURL('img/poi-marker-red.png')
const poiMarkerStarUrl = browser.runtime.getURL('img/poi-marker-star.png')

const starLocationModalVisible = ref(false)
const editedStarLocation = reactive(new MapLocation())

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

watch(() => props.starLocations, () => {
  if (props.isReady && !!_amap.value && !!_map.value) {
    addStarMarkers(_amap.value, _map.value)
  }
}, { deep: true })


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
    'AMap.MapType',
    'AMap.Geolocation',
    'AMap.AutoComplete',
    'AMap.RangingTool',
    'AMap.MouseTool',
  ], () => { // 异步同时加载多个插件
    const scale = new AMap.Scale()
    const toolbar = new AMap.ToolBar()
    const mapType = new AMap.MapType()
    const geolocation = new AMap.Geolocation({
      offset: [20, 88],
    })
    const autoComplete = new AMap.AutoComplete({
      city: '上海',
    })

    const rangingTool = new AMap.RangingTool(map)
    const mouseTool = new AMap.MouseTool(map)
    map.addControl(scale)
    map.addControl(toolbar)
    map.addControl(mapType)
    map.addControl(geolocation)
    // map.addControl(autoComplete)
    // map.addControl(rangingTool)
    // map.addControl(mouseTool)
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

/**
 * 添加收藏地点标注
 */
function addStarMarkers(AMap: any, map: any) {
  const starIcon = new AMap.Icon({
    size: new AMap.Size(25, 25), // 图标尺寸
    image: poiMarkerStarUrl, // Icon的图像
    imageSize: new AMap.Size(25, 25), // 根据所设置的大小拉伸或压缩图片
  })
  props.starLocations.forEach((location) => {
    const marker = new AMap.Marker({
      position: [location.lng, location.lat],
      icon: starIcon,
      anchor: 'bottom-center',
      offset: new AMap.Pixel(0, 0),
    })
    map.add(marker)
    // 设置鼠标划过点标记显示的文字提示
    marker.setTitle(location.description)

    // 设置label标签
    // label默认蓝框白底左上角显示，样式className为：amap-marker-label
    marker.setLabel({
      direction: 'right',
      offset: new AMap.Pixel(10, 0), // 设置文本标注偏移量
      content: `<div class="marker-text info">${location.name}</div>`, // 设置文本标注内容
    })
  })
}

/**
 * 添加房源标注
 */
function addProjectMarkers(AMap: any, map: any) {
  const markerIcon = new AMap.Icon({
    size: new AMap.Size(25, 34), // 图标尺寸
    image: poiMarkerBlueUrl, // Icon的图像
    imageSize: new AMap.Size(25, 34), // 根据所设置的大小拉伸或压缩图片
  })
  props.projects.forEach((project) => {
    const marker = new AMap.Marker({
      position: [project.longitude, project.latitude],
      icon: markerIcon,
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


function createContextMenu(AMap: any, map: any) {
  // 创建右键菜单
  const contextMenu = new AMap.ContextMenu()

  // 右键放大
  contextMenu.addItem('放大一级', () => {
    map.zoomIn()
  }, 0)

  // 右键缩小
  contextMenu.addItem('缩小一级', () => {
    map.zoomOut()
  }, 1)

  // 右键添加Marker标记
  contextMenu.addItem('添加临时标记', (e: any) => {
    tempMarkerCount.value += 1
    const tempLabelText = `临时标记${tempMarkerCount.value}`
    // eslint-disable-next-line no-alert
    const labelText = prompt('标记点名称', tempLabelText)
    if (!labelText) {
      // 取消标记
      tempMarkerCount.value -= 1
      return
    }

    const marker = new AMap.Marker({
      map,
      icon: poiMarkerRedUrl,
      position: contextMenuPositon.value, // 基点位置
      anchor: 'bottom-center',
      offset: new AMap.Pixel(0, 0),
    })
    marker.setLabel({
      direction: 'right',
      offset: new AMap.Pixel(10, 0), // 设置文本标注偏移量
      content: `<div class="marker-text info">${labelText}</div>`, // 设置文本标注内容
    })
  }, 2)

  contextMenu.addItem('收藏地点', (e: any) => {
    console.log('contextMenuPositon', contextMenuPositon.value)
    const location = MapLocation.with({ lng: contextMenuPositon.value.lng, lat: contextMenuPositon.value.lat })
    showStarLocationModal(location)
  }, 3)

  // 右键显示当前经纬度
  contextMenu.addItem('显示当前经纬度', () => {
    // eslint-disable-next-line no-alert
    alert(`当前经纬度：\n${contextMenuPositon.value}`)
  }, 4)


  // 地图绑定鼠标右击事件——弹出右键菜单
  map.on('rightclick', (e: any) => {
    console.log('e', e)
    contextMenu.open(map, e.lnglat)
    contextMenuPositon.value = e.lnglat
  })
}

function showStarLocationModal(location: MapLocation) {
  Object.assign(editedStarLocation, location)
  starLocationModalVisible.value = true
}

function render() {
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
    _amap.value = AMap
    _map.value = new AMap.Map('container', {
      center: mapCenter.value,
      zoom: 12,
    })
    loadPlugins(AMap, _map.value)
    addProjectMarkers(AMap, _map.value)
    addStarMarkers(AMap, _map.value)
    createContextMenu(AMap, _map.value)
  }).catch((e) => {
    console.error(e) // 加载错误提示
  })
}

function toggleFullscreen() {
  if (isFullScreen.value) {
    mapContainerRef.value?.classList.remove('fullscreen')
  } else {
    mapContainerRef.value?.classList.add('fullscreen')
  }
  isFullScreen.value = !isFullScreen.value
}

function onAddStarLocation(location: MapLocation) {
  emit('addStarLocation', location)
}
</script>

<template>
  <div class="amap-render-wrapper">
    <div
      id="container"
      ref="mapContainerRef"
    >
    </div>
    <div class="op-bar">
      <div class="op-items">
        <n-button
          text
          class="fullscreen-btn"
          title="打开/关闭全屏浏览"
          @click="toggleFullscreen"
        >
          <n-icon>
            <FullscreenExitOutlined v-if="isFullScreen" />
            <FullscreenOutlined v-else />
          </n-icon>
        </n-button>
      </div>
    </div>
    <StarLocationModal
      :show="starLocationModalVisible"
      :location="editedStarLocation"
      @add-star-location="onAddStarLocation"
      @close="starLocationModalVisible = false"
    />
  </div>
</template>

<style scoped lang="scss">
.amap-render-wrapper {
  height: 100%;

  :deep(#container) {
    width: 100%;
    height: 100%;

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

  .op-bar {
    position: absolute;
    top: 20px;
    right: 120px;
    z-index: 1001;
    width: fit-content;
    height: 30px;
    padding: 0 10px;
    background-color: #ffffffa6;
    border-radius: 20px;

    .op-items {
      display: flex;
      height: 100%;

      .fullscreen-btn {
        font-size: 24px;
      }
    }
  }
}
</style>

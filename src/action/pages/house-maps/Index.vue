<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { onMounted, shallowRef } from 'vue'
import { StorageService } from '~/libs/storage'
import type { MapAuthCode, MapVendor } from '~/models'

const map = shallowRef<any>(null)

onMounted(async () => {
  const mapAuthCode = await getMapAuthCode()
  initMap(mapAuthCode)
})

async function getMapAuthCode() {
  const options = await StorageService.getOptions()
  return options.mapAuthCode
}

function initMap(mapAuthCode: Record<MapVendor, MapAuthCode>) {
  const amapAuthCode = mapAuthCode.amap
  const baiduAuthCode = mapAuthCode.baidu
  if (amapAuthCode.key && amapAuthCode.secret) {
    renderAmap(amapAuthCode)
  } else if (baiduAuthCode.key) {
    renderBaiduMap(baiduAuthCode)
  }
}

function renderAmap(mapAuthCode: MapAuthCode) {
  window._AMapSecurityConfig = {
    securityJsCode: mapAuthCode.secret!,
  }

  AMapLoader.load({
    key: mapAuthCode.key!, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.Scale',
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
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
    map.value = new AMap.Map('container', {
      center: [116.45, 39.92],
      zoom: 10,
    })
    map.value!.addControl(new AMap.Scale())
  }).catch((e) => {
    console.error(e) // 加载错误提示
  })
}

function renderBaiduMap(mapAuthCode: MapAuthCode) {
  // TODO
}
</script>

<template>
  <div class="map-wrapper">
    <div id="container"></div>
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;

  #container {
    width: 100%;
    height: 100%;
  }
}
</style>

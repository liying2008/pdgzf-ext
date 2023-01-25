<script setup lang="ts">
import { onMounted } from 'vue'
import { render as amapRender } from './amap-render'
import { StorageService } from '~/libs/storage'
import type { MapAuthCode, MapVendor } from '~/models'

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
  amapRender(mapAuthCode)
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

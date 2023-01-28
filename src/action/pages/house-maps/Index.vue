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

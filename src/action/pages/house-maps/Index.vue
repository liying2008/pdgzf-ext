<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { onMounted, shallowRef } from 'vue'

const map = shallowRef<any>(null)

onMounted(() => {
  initMap()
})

function initMap() {
  window._AMapSecurityConfig = {
    securityJsCode: '9d51b945dc7483a41066ab4e46178d7a',
  }
  // const mapOptions: AMap.MapOptions = {
  //   center: [116.45, 39.92],
  //   zoom: 10,

  // }
  // const map = new AMap.Map('container', mapOptions)
  AMapLoader.load({
    key: 'd1130d67789245f31fde1447c31b3205', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: { // 是否加载 AMapUI，缺省不加载
      version: '1.1', // AMapUI 版本
      plugins: ['overlay/SimpleMarker'], // 需要加载的 AMapUI ui插件
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
</script>

<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<style scoped>

</style>

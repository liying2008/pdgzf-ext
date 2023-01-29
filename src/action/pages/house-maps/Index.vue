<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AmapRender from './amap-render/Index.vue'
import { StorageService } from '~/libs/storage'
import { MapAuthCode } from '~/models'

const amapAuthCode = ref(new MapAuthCode())
const baiduAuthCode = ref(new MapAuthCode())

onMounted(async () => {
  const mapAuthCode = await getMapAuthCode()
  amapAuthCode.value = mapAuthCode.amap
  baiduAuthCode.value = mapAuthCode.baidu
})

async function getMapAuthCode() {
  const options = await StorageService.getOptions()
  return options.mapAuthCode
}
</script>

<template>
  <div class="map-wrapper">
    <AmapRender :map-auth-code="amapAuthCode" />
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>

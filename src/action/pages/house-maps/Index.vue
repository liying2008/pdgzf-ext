<script setup lang="ts">
import { ref, watch } from 'vue'
import AmapRender from './amap-render/Index.vue'
import { MapAuthCode } from '~/models'
import { useProjectsQuerier } from '~/compositions/useProjectsQuerier'
import { ProjectQueryWhere } from '~/models/project'
import { usePPV } from '~/compositions/usePPV'
import { useOptions } from '~/compositions/useOptions'

const projectQueryWhere = ref(new ProjectQueryWhere())
const { projects } = useProjectsQuerier(projectQueryWhere, { onLoaded: increaseDataLoadedCount })
const { ppv } = usePPV({ onFirstLoaded: increaseDataLoadedCount })
const { options } = useOptions({ onFirstLoaded: onOptionLoaded })

const dataLoadedCount = ref(0)

// 用于地图渲染的数据是否准备好
const isReady = ref(false)

const amapAuthCode = ref(new MapAuthCode())
const baiduAuthCode = ref(new MapAuthCode())

watch(dataLoadedCount, (newVal) => {
  if (newVal >= 3) {
    isReady.value = true
  }
})


function increaseDataLoadedCount() {
  dataLoadedCount.value += 1
}

function onOptionLoaded() {
  const mapAuthCode = options.value.mapAuthCode
  amapAuthCode.value = mapAuthCode.amap
  baiduAuthCode.value = mapAuthCode.baidu
  increaseDataLoadedCount()
}
</script>

<template>
  <div class="map-wrapper">
    <AmapRender
      :map-auth-code="amapAuthCode"
      :projects="projects"
      :project-properties="options.projectProperties"
      :ppv="ppv"
      :is-ready="isReady"
    />
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AmapRender from './amap-render/Index.vue'
import { MapAuthCode } from '~/models/map-auth-code'
import { useProjectsQuerier } from '~/compositions/useProjectsQuerier'
import { ProjectQueryWhere } from '~/models/project'
import { usePPV } from '~/compositions/usePPV'
import { useOptions } from '~/compositions/useOptions'
import type { MapLocation } from '~/models/map-location'

const projectQueryWhere = ref(new ProjectQueryWhere())
const { projects } = useProjectsQuerier(projectQueryWhere, { onLoaded: increaseDataLoadedCount })
const { ppv } = usePPV({ onFirstLoaded: increaseDataLoadedCount })
const { options } = useOptions({ onFirstLoaded: onOptionLoaded })

const dataLoadedCount = ref(0)

// 用于地图渲染的数据是否准备好
const isReady = ref(false)

const amapAuthCode = ref(new MapAuthCode())
const baiduAuthCode = ref(new MapAuthCode())

const starLocations = ref<MapLocation[]>([])

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
  starLocations.value = options.value.starLocations
  increaseDataLoadedCount()
}

function onAddStarLocation(location: MapLocation) {
  starLocations.value.push(location)
}

function onStarLocationsChange(locations: MapLocation[]) {
  starLocations.value = locations
}
</script>

<template>
  <div class="map-wrapper">
    <AmapRender
      :map-auth-code="amapAuthCode"
      :projects="projects"
      :project-properties="options.projectProperties"
      :ppv="ppv"
      :star-locations="starLocations"
      :is-ready="isReady"
      @add-star-location="onAddStarLocation"
      @update-star-locations="onStarLocationsChange"
    />
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AmapRender from './amap-render/Index.vue'
import { MapAuthCode } from '~/models'
import { useProjectsQuerier } from '~/compositions/useProjectsQuerier'
import { ProjectQueryWhere } from '~/models/project'
import { usePPV } from '~/compositions/usePPV'
import { useOptions } from '~/compositions/useOptions'

const projectQueryWhere = ref(new ProjectQueryWhere())
const { projects } = useProjectsQuerier(projectQueryWhere)
const { ppv } = usePPV({ initialValue: undefined })
const { options } = useOptions({ initialValue: undefined })

// 用于地图渲染的数据是否准备好
const isReady = ref(false)

const amapAuthCode = ref(new MapAuthCode())
const baiduAuthCode = ref(new MapAuthCode())

watch(projects, (newVal) => {
  if (newVal && newVal.length > 0) {
    if (ppv.value && options.value) {
      isReady.value = true
    }
  }
})

watch(ppv, (newVal) => {
  if (newVal) {
    if (projects.value && projects.value.length > 0 && options.value) {
      isReady.value = true
    }
  }
})

watch(options, (newVal) => {
  if (newVal) {
    const mapAuthCode = newVal.mapAuthCode
    amapAuthCode.value = mapAuthCode.amap
    baiduAuthCode.value = mapAuthCode.baidu

    if (projects.value && projects.value.length > 0 && ppv.value) {
      isReady.value = true
    }
  }
})
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import HouseList from './HouseList.vue'
import { useHousesQuerier } from '~/compositions/useHousesQuerier'
import { usePPV } from '~/compositions/usePPV'
import type { House } from '~/models/house'
import { HouseQueryWhere } from '~/models/house'
import type { Project } from '~/models/project'

const houseQueryWhere = ref(new HouseQueryWhere())

const { houses } = useHousesQuerier(houseQueryWhere)
const { ppv } = usePPV()

const newProjectNames = new Set<string>()
const newProjects = ref<Project[]>([])
const newHouses = ref<House[]>([])

watch(houses, () => {
  resolve()
})

watch(ppv, () => {
  resolve()
}, { deep: true })

function resolve() {
  // console.log(houses.value)
  newProjectNames.clear()
  newProjects.value = []
  newHouses.value = []
  houses.value.forEach((house) => {
    const projectName = house.project.name
    if (!(projectName in ppv.value)) {
      if (!newProjectNames.has(projectName)) {
        newProjects.value.push(house.project)
        newProjectNames.add(projectName)
      }
      newHouses.value.push(house)
    }
  })
}
</script>

<template>
  <div class="wrapper">
    <div class="title">
      浦东公租房扩展
    </div>
    <div class="summary">
      当前共新增 <span class="count">{{ newProjects.length }}</span> 个小区， <span class="count">{{ newHouses.length }}</span> 个房源。
    </div>
    <div class="house-list">
      <HouseList :houses="newHouses" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  .title {
    width: 100%;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
  }

  .summary {
    width: 100%;
    font-size: 14px;
    text-align: center;

    .count {
      font-size: 16px;
      font-weight: bold;
      color: green;
    }
  }
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LocalFireDepartmentFilled, TuneFilled } from '@vicons/material'
import { homepage } from '../../../../package.json'
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


const houseNum = computed(() => {
  return houses.value.length
})

const projectNum = computed(() => {
  const projectSet = new Set<string>()
  houses.value.forEach((house) => {
    projectSet.add(house.project.name)
  })
  return projectSet.size
})

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

function openActionPage() {
  browser.tabs.create({
    url: 'action.html',
  }).then((tab) => {
    // console.log('tab', tab)
  })
}

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="wrapper">
    <n-page-header subtitle="选房好运爆棚">
      <n-grid :cols="5">
        <n-gi>
          <n-statistic
            label="当前小区数"
            :value="projectNum"
          />
        </n-gi>
        <n-gi>
          <n-statistic
            label="当前房源数"
            :value="houseNum"
          />
        </n-gi>
      </n-grid>
      <template #title>
        <a
          :href="homepage"
          style=" color: inherit;text-decoration: none;"
        >浦东公租房扩展</a>
      </template>
      <template #avatar>
        <n-avatar
          class="no-background-color"
          src="logo.png"
        />
      </template>
      <template #extra>
        <n-space>
          <n-button
            quaternary
            circle
            type="primary"
            title="更多功能"
            @click="openActionPage"
          >
            <template #icon>
              <n-icon><LocalFireDepartmentFilled /></n-icon>
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            type="info"
            title="打开选项页面"
            @click="openOptionsPage"
          >
            <template #icon>
              <n-icon><TuneFilled /></n-icon>
            </template>
          </n-button>
        </n-space>
      </template>
      <template #footer>
        <div class="summary">
          当前共新增 <span class="count">{{ newProjects.length }}</span> 个小区， <span class="count">{{ newHouses.length }}</span> 个房源。
        </div>
      </template>
    </n-page-header>

    <div class="house-list">
      <HouseList :houses="newHouses" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  .no-background-color {
    background-color: transparent;
  }

  .summary {
    .count {
      font-size: 16px;
      font-weight: bold;
      color: green;
    }
  }

  .house-list {
    margin-top: 16px;
  }
}
</style>

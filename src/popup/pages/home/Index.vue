<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHousesQuerier } from '~/compositions/useHousesQuerier'
import type { House } from '~/models/house'
import { HouseQueryWhere } from '~/models/house'
import type { Project } from '~/models/project'

const houseQueryWhere = ref(new HouseQueryWhere())

const { houses } = useHousesQuerier(houseQueryWhere)

const newProjects = ref<Project[]>([])
const newHourses = ref<House[]>([])

watch(houses, () => {
  resolve()
})

function resolve() {
  console.log(houses.value)
}
</script>

<template>
  <div class="wrapper">
    <div class="title">
      浦东公租房扩展
    </div>
    <div class="summary">
      当前共新增 <span class="count">{{ newProjects.length }}</span> 个小区， <span class="count">{{ newHourses.length }}</span> 个房源。
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

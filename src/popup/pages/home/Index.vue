<script setup lang="ts">
import { ref } from 'vue'
// import { useProjectsQuerier } from '~/compositions/useProjectsQuerier'

// const a = useProjectsQuerier()

const newProjects = ref([])
const newHourses = ref([])
</script>

<template>
  <div class="wrapper">
    <div class="title">
      浦东公租房扩展
    </div>
    <div class="summary">
      今日共新增 <span class="count">{{ newProjects.length }}</span> 个小区， <span class="count">{{ newHourses.length }}</span> 个房源。
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

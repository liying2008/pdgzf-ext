<script setup lang="ts">
import HouseItem from './HouseItem.vue'
import type { House } from '~/models/house'

interface Props {
  houses: House[]
}

const props = withDefaults(defineProps<Props>(), {

})


const emit = defineEmits<{
}>()
</script>

<template>
  <HouseItem
    v-for="(house, index) in houses"
    :key="index"
    :house="house"
  />
</template>

<style scoped>

</style>

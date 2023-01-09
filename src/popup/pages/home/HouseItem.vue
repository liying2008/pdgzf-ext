<script setup lang="ts">
import type { House } from '~/models/house'

interface Props {
  house: House
}

const props = withDefaults(defineProps<Props>(), {

})


const emit = defineEmits<{
}>()
</script>

<template>
  <div>
    {{ house.fullName }}
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import ProjectPropertyView from './project-property/Index.vue'
import MapAuthCodeView from './map-auth-code/Index.vue'
</script>

<template>
  <div class="configuration-wrapper">
    <ProjectPropertyView />
    <div class="space"></div>
    <MapAuthCodeView />
  </div>
</template>

<style scoped lang="scss">
.configuration-wrapper {
  .space {
    height: 16px;
  }
}
</style>

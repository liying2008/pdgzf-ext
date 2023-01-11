<script lang="ts" setup>
</script>

<template>
  <div class="layout-wrapper">
    <n-layout class="main">
      <n-layout class="main-container">
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </div>
</template>

<style lang="scss">
.layout-wrapper {
  .main {
    width: 100%;
    height: 100%;
    clear: both;

    .main-container {
      margin: 16px;
    }
  }
}
</style>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="layout-wrapper">
    <Header></Header>
    <n-layout
      has-sider
      class="main"
    >
      <Sidebar></Sidebar>
      <n-layout>
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </div>
</template>

<style lang="scss">
.layout-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;

  .main {
    position: absolute;
    top: 56px;
    bottom: 0;
    width: 100%;
    clear: both;
  }
}
</style>

<script setup lang="ts">
</script>

<template>
  <n-config-provider style="height: 100%;">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <div class="app">
            <router-view />
          </div>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

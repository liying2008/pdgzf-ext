<script setup lang="ts">
</script>

<template>
  <n-config-provider style="height: 100%;">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <div
            id="app"
            class="app"
          >
            <router-view />
          </div>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

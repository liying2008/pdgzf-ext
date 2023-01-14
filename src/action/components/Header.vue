<script lang="ts" setup>
</script>

<template>
  <n-el class="layout-header">
    <div class="header-left">
      <div class="header-title">
        <span>浦东公租房扩展</span>
        <n-tag
          type="info"
          :bordered="false"
          round
          class="header-tag"
        >
          更多功能
        </n-tag>
      </div>
    </div>
    <div class="header-right">
    </div>
  </n-el>
</template>

<style scoped lang="scss">
.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: var(--base-color);
  border-bottom: solid 1px var(--divider-color);

  .header-left {
    display: flex;
    align-items: center;

    .header-title {
      margin-left: 18px;
      font-size: 18px;
      font-weight: bold;

      .header-tag {
        margin-left: 16px;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}
</style>

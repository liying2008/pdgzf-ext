<script lang="ts" setup>
import type { Component } from 'vue'
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { AlternateEmailFilled, ImportExportFilled, TuneFilled } from '@vicons/material'
import { RouterLink } from 'vue-router'
import { useMenuSelector } from '~/compositions/ui/useMenuSelector'

interface MenuItem {
  compName: string
  title: string
  icon: Component
}


const menuItems: MenuItem[] = [
  {
    compName: 'Configuration',
    title: '配置',
    icon: TuneFilled,
  },
  {
    compName: 'ImportExport',
    title: '导入 & 导出',
    icon: ImportExportFilled,
  },
  {
    compName: 'About',
    title: '关于',
    icon: AlternateEmailFilled,
  },
]

console.log('import-meta-env', import.meta.env)

const menuOptions: MenuOption[] = menuItems.map((menu) => {
  return {
    label: () => h(RouterLink,
      {
        to: {
          name: menu.compName,
        },
      },
      { default: () => menu.title },
    ),
    key: menu.compName,
    icon: renderIcon(menu.icon),
  }
})

const { selectedMenu, onSelectChange } = useMenuSelector()

const collapsed = ref(false)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>

<template>
  <div class="options-sidebar-wrapper">
    <n-layout-sider
      bordered
      class="sidebar"
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        :value="selectedMenu"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :on-update:value="onSelectChange"
      />
    </n-layout-sider>
  </div>
</template>

<style scoped lang="scss">
.options-sidebar-wrapper {
  aside {
    box-sizing: border-box;
    height: 100%;

    .sidebar {
      box-sizing: border-box;
      height: 100%;
      border-spacing: 0;
    }
  }
}
</style>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import type { House } from '~/models/house'
import { getHouseType } from '~/tools'

interface Props {
  houses: House[]
}

const props = withDefaults(defineProps<Props>(), {

})

const columns: DataTableColumns<House> = [
  {
    title: '名称',
    align: 'left',
    key: 'fullName',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
          class: ['item-fullname'],
        },
        { default: () => row.fullName },
      )
    },
  },
  {
    title: '面积',
    align: 'left',
    key: 'area',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => row.area },
      )
    },
  },
  {
    title: '户型',
    align: 'left',
    key: 'typeName',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => getHouseType(row.typeName) },
      )
    },
  },
  {
    title: '已选',
    align: 'center',
    key: 'queueCount',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => row.queueCount },
      )
    },
  },
  {
    title: '租金',
    align: 'center',
    key: 'rent',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
          class: ['item-rent'],
        },
        { default: () => row.rent },
      )
    },
  },
]
</script>

<template>
  <div class="house-list-wrapper">
    <n-data-table
      size="small"
      :columns="columns"
      :data="houses"
      striped
      :bordered="true"
    />
  </div>
</template>

<style scoped lang="scss">
.house-list-wrapper {

}
</style>

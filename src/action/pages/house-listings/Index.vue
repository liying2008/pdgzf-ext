<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { h, ref, watch } from 'vue'
import { useHousesQuerier } from '~/compositions/useHousesQuerier'
import { useOptions } from '~/compositions/useOptions'
import { usePPV } from '~/compositions/usePPV'
import type { House } from '~/models/house'
import { HouseQueryWhere } from '~/models/house'
import type { ProjectPropertyValues } from '~/models/property-value'
import { getHouseType } from '~/tools'


const houseQueryWhere = ref(new HouseQueryWhere())

const { houses } = useHousesQuerier(houseQueryWhere)
const { options } = useOptions({ onFirstLoaded: increaseDataLoadedCount })
const { ppv } = usePPV({ onFirstLoaded: increaseDataLoadedCount })


const originColumns: DataTableColumns<House> = [
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

const columns = ref<DataTableColumns<House>>([])

const dataLoadedCount = ref(0)

watch(dataLoadedCount, (newVal) => {
  if (newVal >= 2) {
    columns.value.push(...originColumns)
    options.value.projectProperties.forEach((pp) => {
      columns.value.push(
        {
          title: pp.name,
          align: 'left',
          key: pp.id,
          sorter: (row1, row2) => getPV(row1.project.name, pp.id, ppv.value) > getPV(row2.project.name, pp.id, ppv.value) ? 1 : -1,
          render(row) {
            return h(
              'span',
              {
              },
              { default: () => getPV(row.project.name, pp.id, ppv.value) },
            )
          },
        },
      )
    })
  }
})

function getPV(project: string, property: string, ppv: ProjectPropertyValues) {
  if (project in ppv && property in ppv[project]) {
    return ppv[project][property]
  } else {
    return ''
  }
}

function increaseDataLoadedCount() {
  dataLoadedCount.value += 1
}
</script>

<template>
  <div class="house-listings-wrapper">
    <n-card title="房源列表">
      <n-data-table
        size="small"
        :columns="columns"
        :data="houses"
        striped
        :bordered="true"
      />
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.house-listings-wrapper {
  padding: 20px;
}
</style>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { h, ref } from 'vue'
import EditModal from './EditModal.vue'

class ProjectProperty {
  id: string
  name: string
  desc: string = ''

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

const columns: DataTableColumns<ProjectProperty> = [
  {
    title: 'ID',
    align: 'left',
    key: 'id',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => row.id },
      )
    },
  },
  {
    title: '属性名',
    align: 'left',
    key: 'name',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => row.name },
      )
    },
  },
  {
    title: '属性描述',
    align: 'left',
    key: 'desc',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => row.desc },
      )
    },
  },
]
const data = ref<ProjectProperty[]>([])
const editModal = ref(false)

function openEditModal() {
  editModal.value = true
}
</script>

<template>
  <div>
    <div class="top-bar">
      <n-space justify="end">
        <n-button
          strong
          secondary
          type="success"
          @click="openEditModal"
        >
          新增
        </n-button>
      </n-space>
    </div>
    <n-data-table
      :columns="columns"
      :data="data"
      striped
    />
    <EditModal
      :visible="editModal"
      @close="editModal = false"
    />
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  margin-bottom: 16px;
}
</style>

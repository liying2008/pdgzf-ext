<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { h, reactive, ref } from 'vue'
import EditModal from './EditModal.vue'
import { ProjectProperty } from '~/models'
import { generateId } from '~/tools'


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
const editedIndex = ref(-1)
const editedItem = reactive(new ProjectProperty())

function openEditModalForAdd() {
  editedIndex.value = -1
  Object.assign(editedItem, new ProjectProperty())
  editedItem.id = generateId()
  editModal.value = true
}

function onClose() {
  editModal.value = false
}
function onSave(index: number, item: ProjectProperty) {
  console.log('onSave', index, item)
  onClose()
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
          @click="openEditModalForAdd"
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
      :edited-index="editedIndex"
      :edited-item="editedItem"
      @save="onSave"
      @close="onClose"
    />
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  margin-bottom: 16px;
}
</style>

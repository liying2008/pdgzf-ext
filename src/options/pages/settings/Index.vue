<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { h, onMounted, reactive, ref } from 'vue'
import EditModal from './EditModal.vue'
import { ProjectProperty } from '~/models'
import { generateId } from '~/tools'
import { StorageService } from '~/libs/storage'


const dialog = useDialog()
const message = useMessage()

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
          class: ['item-id'],
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
        'pre',
        {
          class: ['item-desc'],
        },
        { default: () => row.desc },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row, index) {
      return h(
        'span',
        {
        },
        [
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => openEditModalForEdit(row, index),
            },
            { default: () => '编辑' },
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              type: 'error',
              style: {
                marginLeft: '10px',
              },
              onClick: () => deleteItem(index),
            },
            { default: () => '删除' },
          ),

        ],
      )
    },
  },
]
const data = ref<ProjectProperty[]>([])
const editModal = ref(false)
const editedIndex = ref(-1)
const editedItem = reactive(new ProjectProperty())

onMounted(() => {
  initialize()
})

function initialize() {
  StorageService.getOptions().then((options) => {
    data.value = options.projectProperties
  })
}

function openEditModalForAdd() {
  editedIndex.value = -1
  Object.assign(editedItem, new ProjectProperty())
  editedItem.id = generateId()
  editModal.value = true
}

function openEditModalForEdit(row: ProjectProperty, index: number) {
  editedIndex.value = index
  Object.assign(editedItem, row)
  editModal.value = true
}

function deleteItem(index: number) {
  const row = data.value[index]
  // console.log('row', row)
  dialog.warning({
    title: '提醒',
    content: `确定删除 “${row.name}” 吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      data.value.splice(index, 1)
      // 保存 data
      StorageService.savePartialOptions({
        projectProperties: data.value,
      }).then(() => {
        message.success('已删除')
      }).catch((e) => {
        message.error(`删除失败：${e.message}`)
      })
    },
    onNegativeClick: () => {
      // nothing to do.
    },
  })
}

function onClose() {
  editModal.value = false
}
function onSave(index: number, item: ProjectProperty) {
  console.log('onSave', index, item)
  const copied = Object.assign({}, item)
  if (index === -1) {
    // 添加
    data.value.push(copied)
  } else {
    // 更新
    data.value.splice(index, 1, copied)
  }
  // 保存 data
  StorageService.savePartialOptions({
    projectProperties: data.value,
  }).then(() => {
    message.success('保存成功')
    onClose()
  }).catch((e) => {
    message.error(`保存失败：${e.message}`)
  })
}
</script>

<template>
  <div class="settings-wrapper">
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
.settings-wrapper {
  .top-bar {
    margin-bottom: 16px;
  }

  :deep(.item-id) {
    font-style: italic;
    color: #00000080;
  }

  :deep(.item-desc) {
    margin: 0;
    font-family: inherit;
  }
}
</style>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDivider } from 'naive-ui'
import { h, onMounted, reactive, ref } from 'vue'
import { DeleteOutlineFilled, EditNoteFilled, KeyboardArrowDownFilled, KeyboardArrowUpFilled } from '@vicons/material'
import EditModal from './EditModal.vue'
import { ProjectProperty } from '~/models'
import { generateId } from '~/tools'
import { StorageService } from '~/libs/storage'
import PopconfirmDeleteBtn from '~/components/PopconfirmDeleteBtn.vue'
import IconBtn from '~/components/IconBtn.vue'


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
            IconBtn,
            {
              icon: EditNoteFilled,
              iconSize: '18px',
              type: 'primary',
              btnClass: 'item-action-edit',
              btnTitle: '编辑',
              onClick: () => openEditModalForEdit(row, index),
            },
          ),
          h(
            PopconfirmDeleteBtn,
            {
              text: `确定删除 “${row.name}” 吗？`,
              btnClass: 'item-action-delete',
              btnTitle: '删除该属性',
              icon: DeleteOutlineFilled,
              iconSize: '18px',
              onPositiveClick: () => {
                deleteItem(index)
              },
            },
          ),
          h(
            NDivider,
            {
              vertical: true,
              style: {
                verticalAlign: 'inherit',
              },
            },
          ),
          h(
            IconBtn,
            {
              icon: KeyboardArrowUpFilled,
              iconSize: '18px',
              type: 'info',
              btnClass: 'item-action-up',
              btnTitle: '前移',
              disabled: index === 0,
              onClick: () => moveUp(index),
            },
          ),
          h(
            IconBtn,
            {
              icon: KeyboardArrowDownFilled,
              iconSize: '18px',
              type: 'info',
              btnClass: 'item-action-up',
              btnTitle: '后移',
              disabled: index === data.value.length - 1,
              onClick: () => moveDown(index),
            },
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
  // console.log('row', data.value[index])
  data.value.splice(index, 1)
  // 保存 data
  StorageService.savePartialOptions({
    projectProperties: data.value,
  }).then(() => {
    message.success('已删除')
  }).catch((e) => {
    message.error(`删除失败：${e.message}`)
  })
}

/**
 * 指定索引的元素和其前一个元素交换位置
 * @param index 索引
 */
function moveUp(index: number) {
  data.value[index] = data.value.splice(index - 1, 1, data.value[index])[0]
}

/**
 * 指定索引的元素和其后一个元素交换位置
 * @param index 索引
 */
function moveDown(index: number) {
  data.value[index] = data.value.splice(index + 1, 1, data.value[index])[0]
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
      size="small"
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

  :deep(.item-action-delete) {
  }
}
</style>

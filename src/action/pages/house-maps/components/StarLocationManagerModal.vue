<script lang="ts" setup>
import { h, reactive, ref, watch } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { DeleteOutlineFilled, EditNoteFilled } from '@vicons/material'
import StarLocationEditModal from './StarLocationEditModal.vue'
import { useEditableProp } from '~/compositions/useEditableProp'
import { MapLocation } from '~/models/map-location'
import PopconfirmDeleteBtn from '~/components/PopconfirmDeleteBtn.vue'
import IconBtn from '~/components/IconBtn.vue'
import { StorageService } from '~/libs/storage'

const props = defineProps<{
  show: boolean
  starLocations: MapLocation[]
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'change', locations: MapLocation[]): void
}>()

const message = useMessage()

const editableVisible = useEditableProp(() => props.show, (newVal) => {
  !newVal && emit('close')
})
const editableLocations = useEditableProp(() => props.starLocations)

const columns: DataTableColumns<MapLocation> = [
  {
    title: '名称',
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
    title: '描述',
    align: 'left',
    key: 'description',
    sorter: 'default',
    render(row) {
      return h(
        'pre',
        {
          class: ['item-desc'],
        },
        { default: () => row.description },
      )
    },
  },
  {
    title: '位置坐标',
    align: 'left',
    key: 'name',
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
        },
        { default: () => `${row.lng}, ${row.lat}` },
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
        ],
      )
    },
  },
]

const editModal = ref(false)
const editedIndex = ref(-1)
const editedItem = reactive(new MapLocation())


watch(editableVisible, (newVal: boolean) => {
  if (newVal) {
    // no op
  }
})

function openEditModalForAdd() {
  editedIndex.value = -1
  Object.assign(editedItem, new MapLocation())
  editModal.value = true
}

function openEditModalForEdit(row: MapLocation, index: number) {
  editedIndex.value = index
  Object.assign(editedItem, row)
  editModal.value = true
}

function deleteItem(index: number) {
  // console.log('row', editableLocations.value[index])
  editableLocations.value.splice(index, 1)
  // 保存 data
  StorageService.savePartialOptions({
    starLocations: editableLocations.value,
  }).then(() => {
    message.success('已删除')
    emit('change', editableLocations.value)
  }).catch((e) => {
    message.error(`删除失败：${e.message}`)
  })
}

function onClose() {
  editModal.value = false
}

function onSave(index: number, item: MapLocation) {
  console.log('onSave', index, item)
  const copied = Object.assign({}, item)
  if (index === -1) {
    // 添加
    editableLocations.value.push(copied)
  } else {
    // 更新
    editableLocations.value.splice(index, 1, copied)
  }
  // 保存 data
  StorageService.savePartialOptions({
    starLocations: editableLocations.value,
  }).then(() => {
    message.success('保存成功')
    emit('change', editableLocations.value)
    onClose()
  }).catch((e) => {
    message.error(`保存失败：${e.message}`)
  })
}
</script>

<template>
  <n-modal
    v-model:show="editableVisible"
    class="star-location-manager-modal"
    preset="dialog"
    title="收藏地点管理"
    style="width: 80%;"
    type="info"
  >
    <n-card
      title="收藏地点列表"
      embedded
      :bordered="false"
    >
      <template #header-extra>
        <div>
          <n-button
            strong
            secondary
            size="small"
            type="success"
            @click="openEditModalForAdd"
          >
            新增
          </n-button>
        </div>
      </template>

      <n-data-table
        size="small"
        :columns="columns"
        :data="editableLocations"
      />
    </n-card>
    <StarLocationEditModal
      :visible="editModal"
      :edited-index="editedIndex"
      :edited-item="editedItem"
      @save="onSave"
      @close="onClose"
    />
  </n-modal>
</template>

<style lang="scss">
.star-location-manager-modal {
  .item-desc {
    margin: 0;
    font-family: inherit;
  }
}
</style>

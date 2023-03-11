<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { computed, reactive, ref, watch } from 'vue'
import { useEditableProp } from '~/compositions/useEditableProp'
import type { MapLocation } from '~/models/map-location'

interface Props {
  visible: boolean
  editedIndex: number
  editedItem: MapLocation
}

const props = withDefaults(defineProps<Props>(), {

})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', index: number, item: MapLocation): void
}>()

const editableVisible = useEditableProp(() => props.visible, (newVal) => {
  !newVal && emit('close')
})

const formRef = ref<FormInst | null>(null)
const rules = {
  name: {
    required: true,
    message: '请输入属性名',
    trigger: 'blur',
  },
}
const editableItem = reactive(props.editedItem)

const formTitle = computed(() => props.editedIndex === -1 ? '新增' : '编辑')

// important: 根据传入的数据重新渲染表单
watch(() => props.editedItem, (newVal) => {
  Object.assign(editableItem, newVal)
})


function save() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('save', props.editedIndex, editableItem)
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <n-modal
    v-model:show="editableVisible"
    preset="dialog"
    title="Dialog"
  >
    <template #header>
      <div>{{ formTitle }}</div>
    </template>
    <n-form
      ref="formRef"
      :label-width="80"
      :model="editableItem"
      :rules="rules"
    >
      <n-form-item
        label="名称"
        path="name"
      >
        <n-input
          v-model:value="editableItem.name"
          placeholder="名称"
        />
      </n-form-item>
      <n-form-item
        label="描述"
        path="description"
      >
        <n-input
          v-model:value="editableItem.description"
          type="textarea"
          placeholder="描述"
        />
      </n-form-item>
      <n-form-item
        label="经度"
        path="lng"
      >
        <n-input-number
          v-model:value="editableItem.lng"
          type="number"
          placeholder="经度"
        />
      </n-form-item>
      <n-form-item
        label="纬度"
        path="lat"
      >
        <n-input-number
          v-model:value="editableItem.lat"
          type="number"
          placeholder="纬度"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button
        type="primary"
        @click="save"
      >
        保存
      </n-button>
    </template>
  </n-modal>
</template>

<style scoped>

</style>

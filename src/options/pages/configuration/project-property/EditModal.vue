<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { computed, reactive, ref, watch } from 'vue'
import { useEditableProp } from '~/compositions/useEditableProp'
import type { ProjectProperty } from '~/models/project-property'

interface Props {
  visible: boolean
  editedIndex: number
  editedItem: ProjectProperty
}

const props = withDefaults(defineProps<Props>(), {

})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', index: number, item: ProjectProperty): void
}>()

const editableVisible = useEditableProp(() => props.visible, (newVal) => {
  !newVal && emit('close')
})

const formRef = ref<FormInst | null>(null)
const rules = {
  id: {
    required: true,
    message: '请输入ID',
    trigger: 'blur',
  },
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
        label="ID"
        path="id"
      >
        <n-input
          v-model:value="editableItem.id"
          :disabled="true"
          placeholder="ID"
        />
      </n-form-item>
      <n-form-item
        label="属性名"
        path="name"
      >
        <n-input
          v-model:value="editableItem.name"
          placeholder="属性名"
        />
      </n-form-item>
      <n-form-item
        label="属性描述"
        path="desc"
      >
        <n-input
          v-model:value="editableItem.desc"
          type="textarea"
          placeholder="属性描述"
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

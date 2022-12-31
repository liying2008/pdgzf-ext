<script setup lang="ts">
import { useEditableProp } from '~/compositions/useEditableProp'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {

})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void
}>()

const editableVisible = useEditableProp(() => props.visible, (newVal) => {
  !newVal && emit('close')
})
</script>

<template>
  <n-modal
    v-model:show="editableVisible"
    preset="dialog"
    title="Dialog"
  >
    <template #header>
      <div>标题</div>
    </template>
    <div>内容</div>
    <template #action>
      <div>操作</div>
    </template>
  </n-modal>
</template>

<style scoped>

</style>

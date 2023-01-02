<script lang="ts" setup>
interface Props {
  text: string
  positiveText?: string
  negativeText?: string
  btnClass?: string
  btnTitle?: string
  btnStyle?: object
  icon: object
  iconSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  positiveText: '确定',
  negativeText: '取消',
  btnClass: '',
  btnTitle: '',
  btnStyle: () => ({}),
  iconSize: '',
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'positiveClick'): void
  (e: 'negativeClick'): void
}>()
</script>

<template>
  <n-popconfirm
    :positive-text="positiveText"
    :negative-text="negativeText"
    @positive-click="emit('positiveClick')"
    @negative-click="emit('negativeClick')"
  >
    <template #trigger>
      <n-button
        quaternary
        circle
        type="error"
        :class="btnClass"
        :style="btnStyle"
        :title="btnTitle"
      >
        <n-icon
          :size="iconSize"
          :component="icon"
        >
        </n-icon>
      </n-button>
    </template>
    {{ text }}
  </n-popconfirm>
</template>

<style lang="scss" scoped>
</style>

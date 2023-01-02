<script lang="ts" setup>
import type { Type } from 'naive-ui/es/button/src/interface'

interface Props {
  btnType?: Type
  btnClass?: string
  btnTitle?: string
  btnStyle?: object
  icon: object
  iconSize?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  btnType: 'default',
  btnClass: '',
  btnTitle: '',
  btnStyle: () => ({}),
  iconSize: '',
  disabled: false,
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <n-button
    quaternary
    circle
    :type="btnType"
    :class="btnClass"
    :style="btnStyle"
    :title="btnTitle"
    :disabled="disabled"
    @click="emit('click')"
  >
    <template #icon>
      <n-icon
        :size="iconSize"
        :component="icon"
      >
      </n-icon>
    </template>
  </n-button>
</template>

<style lang="scss" scoped>
</style>

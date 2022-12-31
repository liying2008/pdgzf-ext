import { computed } from 'vue'

/**
 * 将 prop value 用 computed 包装，使之成为可读写的变量
 * @param getProp 获取 prop value 函数
 * @param onChange 当 prop value 变化时，调用的函数
 * @returns computed prop value
 */
export function useEditableProp<T>(getProp: () => T, onChange?: (newVal: T) => void) {
  const editableProp = computed({
    get() {
      return getProp()
    },
    set(newVal) {
      onChange && onChange(newVal)
    },
  })

  return editableProp
}

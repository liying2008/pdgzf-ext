import { onMounted, onUnmounted, ref } from 'vue'
import type { StorageChangeWrapper } from '~/libs/storage'
import { StorageService } from '~/libs/storage'
import { Options } from '~/models'

export function useOptions() {
  const options = ref<Options>(Options.default())

  query()

  onMounted(() => {
    // 添加 options 变动监听
    StorageService.addStorageListener(onStorageChange)
  })

  onUnmounted(() => {
    StorageService.removeStorageListener(onStorageChange)
  })

  function onStorageChange(changes: StorageChangeWrapper) {
    if (StorageService.keyForOptions in changes) {
      // Options 有改变
      // console.log('changes', changes)
      options.value = changes[StorageService.keyForOptions].newValue
    }
  }

  async function query() {
    options.value = await StorageService.getOptions()
  }

  return {
    options,
  }
}

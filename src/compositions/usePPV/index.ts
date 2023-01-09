import { onMounted, onUnmounted, ref } from 'vue'
import type { StorageChangeWrapper } from '~/libs/storage'
import { StorageService } from '~/libs/storage'
import type { ProjectPropertyValues } from '~/models'

export function usePPV() {
  const ppv = ref<ProjectPropertyValues>({})

  query()

  onMounted(() => {
    // 添加 options 变动监听
    StorageService.addStorageListener(onStorageChange)
  })

  onUnmounted(() => {
    StorageService.removeStorageListener(onStorageChange)
  })

  function onStorageChange(changes: StorageChangeWrapper) {
    if (StorageService.keyForPPV in changes) {
      // PPV 有改变
      // console.log('changes', changes)
      ppv.value = changes[StorageService.keyForPPV].newValue
    }
  }

  async function query() {
    ppv.value = await StorageService.getPPV()
  }

  return {
    ppv,
  }
}

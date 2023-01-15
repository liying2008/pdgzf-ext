import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export function useMenuSelector() {
  const route = useRoute()

  const selectedMenu = ref('')

  // watch(selectedMenu, (newVal) => {
  //   console.log('selectedMenu', newVal)
  // })

  onMounted(() => {
    const routeName = route.name
    // console.log(routeName)
    selectedMenu.value = routeName!.toString()
  })

  function onSelectChange(key: string) {
    // console.log('key', key)
    selectedMenu.value = key
  }

  return {
    selectedMenu,
    onSelectChange,
  }
}

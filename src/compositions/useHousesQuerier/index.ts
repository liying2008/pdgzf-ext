import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useAxios } from '../useAxios'
import type { PagedData, Resp, Wrapper } from '~/models/resp'
import type { House, HouseQueryWhere } from '~/models/house'

export function useHousesQuerier(where: Ref<HouseQueryWhere>) {
  const axios = useAxios()

  const houses = ref<House[]>([])

  watch(where, () => {
    query()
  }, { deep: true })

  query()

  function query() {
    const postData = {
      where: where.value,
      pageIndex: 0,
      pageSize: 100,
    }
    axios.post('/app/gzf/house/list', postData).then((res: Resp<Wrapper<PagedData<House[]>>>) => {
      console.log(res.data)
      const wrapper = res.data
      if (!wrapper.success) {
        // TODO
      }
      houses.value = wrapper.data.data
    })
  }

  return {
    houses,
  }
}

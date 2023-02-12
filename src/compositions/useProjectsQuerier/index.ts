import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useAxios } from '../useAxios'
import type { Project, ProjectQueryWhere } from '~/models/project'
import type { PagedData, Resp, Wrapper } from '~/models/resp'

interface OptionalParamsType {
  onLoaded?: (() => void)
}

export function useProjectsQuerier(where: Ref<ProjectQueryWhere>, { onLoaded = undefined }: OptionalParamsType = {}) {
  const axios = useAxios()

  const projects = ref<Project[]>([])

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
    axios.post('/app/gzf/project/list', postData).then((res: Resp<Wrapper<PagedData<Project[]>>>) => {
      console.log(res.data)
      const wrapper = res.data
      if (!wrapper.success) {
        // TODO
        return
      }
      projects.value = wrapper.data.data
      onLoaded && onLoaded()
    })
  }

  return {
    projects,
  }
}

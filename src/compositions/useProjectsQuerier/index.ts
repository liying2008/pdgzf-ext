import { ref } from 'vue'
import { useAxios } from '../useAxios'
import type { Project } from '~/models/project'
import type { PagedData, Resp, Wrapper } from '~/models/resp'

export function useProjectsQuerier() {
  const axios = useAxios()

  const projects = ref<Project[]>([])
  query()

  function query() {
    const postData = {
      where: {
        keywords: '',
        areaId: null,
      },
      pageIndex: 0,
      pageSize: 100,
    }
    axios.post('/app/gzf/project/list', postData).then((res: Resp<Wrapper<PagedData<Project[]>>>) => {
      console.log(res.data)
      const wrapper = res.data
      if (!wrapper.success) {
        // TODO
      }
      projects.value = wrapper.data.data
    })
  }

  return {
    projects,
  }
}

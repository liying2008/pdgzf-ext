import { useAxios } from '../useAxios'

export function useProjectsQuerier() {
  const axios = useAxios()

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
    axios.post('/app/gzf/project/list', postData).then((res) => {
      console.log(res)
    })
  }
}

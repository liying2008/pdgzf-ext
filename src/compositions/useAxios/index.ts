import type { AxiosInstance } from 'axios'
import { inject } from 'vue'
import axios from '~/plugins/axios'

export function useAxios() {
  const $axios: AxiosInstance | null | undefined = inject('$axios')
  if ($axios) {
    return $axios
  } else {
    console.error('[pdgzf-ext] inject axios error')
    return axios
  }
}

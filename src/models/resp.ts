export interface Resp<W> {
  data: W
  status: number
  statusText: string
}

export interface Wrapper<D> {
  data: D
  message: string
  success: boolean
}

export interface PagedData<T> {
  totalCount: number
  pageCount: number
  data: T
}

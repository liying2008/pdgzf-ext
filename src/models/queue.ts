export interface Queue {
  cancelTime: string | null // 如：null
  createTime: string // 如：2022-12-22 10:13:38
  id: number // 如：625850
  position: number // 如：4
  qualification: Qualification
  serverAccountId: string // 如：07524e42-3855-407d-bb73-538d949945ef
  status: string // 如：Failure
  successTime: string | null // 如：null
  updateTime: string | null // 如：2022-12-23 09:33:32
}

export interface Qualification {
  code: string // 如：202217140008526
  dataId: string // 如：e269ae82-fd4d-4ffa-b97c-3588934b985f
  id: number // 如：475004
  maxSelectableHouseType: number // 如：4
  name: string // 如：张三
  serverAccountId: string // 如：07524e42-3855-407d-bb73-538d949945ef
  startDate: string // 如：2022-07-22
  used: boolean // 如：false
}

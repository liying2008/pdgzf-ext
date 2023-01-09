import type { Project } from './project'
import type { Queue } from './queue'

export interface House {
  address: string // 如：年家浜东路168弄（锦绣御澜）/01号/07楼/703
  area: string // 如：52.78
  cancelMark: number // 如：0
  createTime: string // 如：2022-12-16 01:00:06
  emoveInDate: number // 如：1672502400000
  floorName: string // 如：07
  fullName: string // 如：年家浜东路168弄（锦绣御澜）/01号/07楼/703
  id: number // 如：621580
  isSearchRoom: number // 如：0
  name: string // 如：703
  project: Project
  propertyName: string // 如：年家浜东路168弄（锦绣御澜）
  // queue 登录之后才能获取
  queue: Queue[]
  queueCount: number // 如：10
  rent: number // 如：3038
  selectEndTime: string // 如：2023-01-10 09:30:00
  selectStartTime: string // 如：2023-01-09 10:00:00
  selectable: boolean // 如：true
  systemTime: string // 如：2023-01-09 20:28:21
  typeName: number // 如：1
  updateTime: string // 如：2023-01-09 20:07:22
}

export type QueryRent = 'Below1000' | 'Between1000And1999' | 'Between2000And2999' | 'Between3000And3999' | 'Between4000And4999' | 'Between5000And5999' | 'Between6000And6999' | 'Between7000And8000'

export class HouseQueryWhere {
  /**
   * 搜索关键字
   */
  keywords: string = ''
  /**
   * 区域
   */
  township: string | null = null
  /**
   * 小区ID，如 621532
   */
  projectId: number | null = null
  /**
   * 户型
   * 1-8, 分别对应 一室，一室一厅，两室，两室一厅，三室，三室一厅，四室，五室
   */
  typeName: string | null = null
  /**
   * 租金
   */
  rent: QueryRent | null = null
}

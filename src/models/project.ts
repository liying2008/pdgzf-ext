export interface Project {
  id: number // 如：621532
  apiId: string // 如：3ab8660a-0455-48d6-b402-8288f748f382
  name: string // 如：年家浜东路168弄（锦绣御澜）
  region: string // 如：310115
  regionName: string // 如：浦东新区
  township: string // 如：310115132
  townshipName: string // 如：周浦镇
  houseCount: number // 如：50
  rentableCount: number // 如：7
  longitude: number // 如：121.597976
  latitude: number // 如：31.119105
  createTime: string // 如：2022-12-16 01:00:01
  updateTime: string // 如：2023-01-09 10:05:00
  queueNotice: string // 如：本小区20230108001周期共提供可选房源7套，参与本小区轮候选房人数共76人，共选中1套房，选中率14.29%。\n本小区20230107001周期共提供可选房源9套，参与本小区轮候选房人数共24人，共选中1套房，选中率11.11%。\n本小区20230106001周期共提供可选房源1套，参与本小区轮候选房人数共70人，共选中1套房，选中率100.00%。
}

export class ProjectQueryWhere {
  /**
   * 搜索关键字
   */
  keywords: string = ''
  /**
   * 区域ID
   */
  areaId: string | null = null
}

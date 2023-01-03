
export const CMD_GET_PROJECT_PROPERTIES = 'get_project_properties'
export const CMD_GET_PPV = 'get_ppv'
export const CMD_SET_PPV = 'set_ppv'

export class ContentMessage<T = any> {
  cmd: string
  data: T | null

  constructor(cmd: string, data: T | null = null) {
    this.cmd = cmd
    this.data = data
  }
}

export type ContentRespStatus = 'ok' | 'error'

export class ContentResp<T = any> {
  status: ContentRespStatus
  message: string
  data: T | null

  constructor(status: ContentRespStatus, message: string, data: T | null) {
    this.status = status
    this.message = message
    this.data = data
  }

  static fromObj(obj: Partial<ContentResp>) {
    const { status = 'ok', message = '', data = null } = obj
    return new this(status, message, data)
  }
}

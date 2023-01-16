interface AMapSecurityConfig {
  securityJsCode: string
}

declare interface Window {
  _AMapSecurityConfig: AMapSecurityConfig
}

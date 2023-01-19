declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

interface AMapSecurityConfig {
  securityJsCode: string
}

declare interface Window {
  _AMapSecurityConfig: AMapSecurityConfig
}

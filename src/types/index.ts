export interface Locale {
  'view-source': string
  'hide-source': string
  'edit-in-editor': string
  'edit-on-github': string
  'copy-code': string
  'copy-success': string
  'copy-error': string
}

export interface Locales {
  [key: string]: Locale
}

export interface DemoblockPluginOptions {
  customClass?: string
}

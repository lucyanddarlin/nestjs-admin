import { APP_REG_TOKEN, AppConfig, IAppConfig } from './app.config'

export interface AllConfigType {}

export * from './app.config'

export interface AllConfigType {
  [APP_REG_TOKEN]: IAppConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
}

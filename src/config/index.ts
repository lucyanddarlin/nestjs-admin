import { APP_REG_TOKEN, AppConfig, IAppConfig } from './app.config'
import { ISwaggerConfig, SWAGGER_REG_TOKEN, SwaggerConfig } from './swagger.config'

export interface AllConfigType {}

export * from './app.config'
export * from './swagger.config'

export interface AllConfigType {
  [APP_REG_TOKEN]: IAppConfig
  [SWAGGER_REG_TOKEN]: ISwaggerConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  SwaggerConfig,
}

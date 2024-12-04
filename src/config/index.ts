import { APP_REG_TOKEN, AppConfig, IAppConfig } from './app.config'
import { DatabaseConfig, DB_REG_TOKEN, IDataBaseConfig } from './database.config'
import { IRedisConfig, REDIS_REG_TOKEN, RedisConfig } from './redis.config'
import { ISwaggerConfig, SWAGGER_REG_TOKEN, SwaggerConfig } from './swagger.config'

export interface AllConfigType {}

export * from './app.config'
export * from './swagger.config'

export interface AllConfigType {
  [APP_REG_TOKEN]: IAppConfig
  [SWAGGER_REG_TOKEN]: ISwaggerConfig
  [DB_REG_TOKEN]: IDataBaseConfig
  [REDIS_REG_TOKEN]: IRedisConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  SwaggerConfig,
  DatabaseConfig,
  RedisConfig,
}

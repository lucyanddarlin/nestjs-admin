import { env, envBoolean } from '@/global/env'
import { ConfigType, registerAs } from '@nestjs/config'

export const SWAGGER_REG_TOKEN = 'swagger'

export const SwaggerConfig = registerAs(SWAGGER_REG_TOKEN, () => ({
  enable: envBoolean('SWAGGER_ENABLE'),
  path: env('SWAGGER_PATH'),
}))

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>

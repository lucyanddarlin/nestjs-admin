import { env, envBoolean, envNumber } from '@/global/env'
import { ConfigType, registerAs } from '@nestjs/config'

export const APP_REG_TOKEN = 'app'

const globalPrefix = env('GLOBAL_PREFIX', 'api')
export const AppConfig = registerAs(APP_REG_TOKEN, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  baseUrl: env('APP_BASE_URL'),
  globalPrefix,
  locale: env('APP_LOCALE', 'zh-CN'),
  multiDeviceLogin: envBoolean('MULTI_DEVICE_LOGIN', true),

  logger: {
    level: env('LOGGER_LEVEL'),
    maxFiles: envNumber('LOGGER_MAX_FILES'),
  },
}))

export type IAppConfig = ConfigType<typeof AppConfig>

export const RouterWhiteList: string[] = [
  `${globalPrefix ? '/' : ''}${globalPrefix}/auth/captcha/img`,
]

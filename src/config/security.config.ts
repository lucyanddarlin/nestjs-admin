import { env, envNumber } from '@/global/env'
import { ConfigType, registerAs } from '@nestjs/config'

export const SECURITY_REG_TOKEN = 'security'

export const SecurityConfig = registerAs(SECURITY_REG_TOKEN, () => ({
  jwtSecret: env('JWT_SECRET'),
  jwtExpire: envNumber('JWT_EXPIRE'),
  refreshSecret: env('REFRESH_TOKEN_SECRET'),
  refreshExpire: envNumber('REFRESH_TOKEN_EXPIRE'),
}))

export type ISecurityConfig = ConfigType<typeof SecurityConfig>

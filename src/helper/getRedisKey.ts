import { RedisKeys } from '@/constant/redis.constant'

/**
 * @description 生成验证码 redis key
 */
export function getCaptchaRedisKey(val: string | number) {
  return `${RedisKeys.CAPTCHA_IMG_PREFIX}${String(val)}` as const
}

export function getAuthTokenKey(val: string | number) {
  return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(val)}` as const
}

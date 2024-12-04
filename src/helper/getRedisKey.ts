import { RedisKeys } from '@/constant/redis.constant'

/**
 * @description 生成验证码 redis key
 */
export function getCaptchaRedisKey(val: string | number) {
  return `${RedisKeys.CAPTCHA_IMG_PREFIX}${String(val)}` as const
}

import { RedisKeys } from '@/constant/redis.constant'

type Prefix = 'm-shop'
const prefix = 'm-shop'

export function getRedisKey<T extends string = RedisKeys | '*'>(
  key: T,
  ...contactKeys: string[]
): `${Prefix}:${T}${string | ''}` {
  return `${prefix}:${key}${contactKeys && contactKeys.length
    ? `:${contactKeys.join('_')}`
    : ''}`
}

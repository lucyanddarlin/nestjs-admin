import { REDIS_CLIENT } from '@/constant/redis.constant'
import { Inject } from '@nestjs/common'

export const InjectRedis = () => Inject(REDIS_CLIENT)

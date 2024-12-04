import type { Redis } from 'ioredis'
import { API_CACHE_PREFIX, REDIS_IO_ADAPTER_KEY } from '@/constant/redis.constant'
import { getRedisKey } from '@/utils/redis.util'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Emitter } from '@socket.io/redis-emitter'
import { Cache } from 'cache-manager'

export type TCacheKey = string
export type TCacheResult<T> = Promise<T | undefined>

@Injectable()
export class RedisService {
  private cache: Cache
  private _emitter: Emitter

  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache
  }

  private get redisClient(): Redis {
    return (this.cache.store as any).client
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    return this.cache.get(key)
  }

  public set(key: TCacheKey, value: any, milliseconds: number) {
    return this.cache.set(key, value, milliseconds)
  }

  public getClient() {
    return this.redisClient
  }

  public get emitter(): Emitter {
    if (!this._emitter) {
      this._emitter = new Emitter(this.redisClient, {
        key: REDIS_IO_ADAPTER_KEY,

      })
    }
    return this._emitter
  }

  public async cleanCatch() {
    const redis = this.getClient()
    const keys: string[] = await redis.keys(`${API_CACHE_PREFIX}*`)
    await Promise.all(keys.map(key => redis.del(key)))
  }

  public async cleanAllRedisKey() {
    const redis = this.getClient()
    const keys: string[] = await redis.keys(getRedisKey('*'))
    await Promise.all(keys.map(key => redis.del(key)))
  }
}

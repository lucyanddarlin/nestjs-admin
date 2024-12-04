import { ConfigKeyPaths } from '@/config'
import { IRedisConfig, REDIS_REG_TOKEN } from '@/config/redis.config'
import { REDIS_CLIENT } from '@/constant/redis.constant'
import { RedisModule as NestRedisModule, RedisService } from '@liaoliaots/nestjs-redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-ioredis-yet'
import { RedisService as CacheService } from './redis.service'

const providers: Provider[] = [
  CacheService,
  {
    provide: REDIS_CLIENT,
    useFactory: (redisService: RedisService) => redisService.getOrThrow(),
    inject: [RedisService],
  },
]

@Global()
@Module({
  imports: [
    // cache
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory(configServer: ConfigService<ConfigKeyPaths>) {
        const redisOptions = configServer.get<IRedisConfig>(REDIS_REG_TOKEN)
        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
        }
      },
      inject: [ConfigService],
    }),
    // redis
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServer: ConfigService<ConfigKeyPaths>) => ({
        readyLog: true,
        config: configServer.get(REDIS_REG_TOKEN),
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers, CacheModule],
})
export class RedisModule {}

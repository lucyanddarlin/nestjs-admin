import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'
import { RedisModule } from './redis/redis.module'

@Global()
@Module({
  imports: [
    LoggerModule.forRoot(),
    HttpModule,
    RedisModule,
  ],
  exports: [
    HttpModule,
    RedisModule,
  ],
})
export class SharedModule {}

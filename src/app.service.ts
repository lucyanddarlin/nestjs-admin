import { Inject, Injectable } from '@nestjs/common'
import { RedisService } from './shared/redis/redis.service'

@Injectable()
export class AppService {
  @Inject()
  private redisService: RedisService

  async getHello() {
    const redis = this.redisService.getClient()
    await redis.set('demo', 123)
    return 'hello world'
  }
}

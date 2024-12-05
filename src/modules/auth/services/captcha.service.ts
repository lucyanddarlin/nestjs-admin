import { InjectRedis } from '@/common/decorators/inject-redis.decorator'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { getCaptchaRedisKey } from '@/helper/getRedisKey'
import { ImageCaptcha } from '@/modules/models/auth.model'
import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'

@Injectable()
export class CaptchaService {
  constructor(
    @InjectRedis() private redis: Redis,
  ) {}

  /**
   * @description 检验图片验证码
   */
  async checkCaptchaImg(id: ImageCaptcha['id'], code: string) {
    const captchaRedisKey = getCaptchaRedisKey(id)
    const res = await this.redis.get(captchaRedisKey)
    if (isEmpty(res) || code.toLowerCase() !== res.toLowerCase()) {
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
    }

    await this.redis.del(captchaRedisKey)
  }
}

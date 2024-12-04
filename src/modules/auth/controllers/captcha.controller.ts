import { InjectRedis } from '@/common/decorators/inject-redis.decorator'
import { getCaptchaRedisKey } from '@/helper/getRedisKey'
import { generateUUID } from '@/utils'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import Redis from 'ioredis'
import * as SvgCaptcha from 'svg-captcha'
import { ImageCaptchaDto } from '../dto/captcha.dto'

@ApiTags('Captcha - 验证码模块')
@Controller('auth/captcha')
export class CaptchaController {
  @InjectRedis() private redis: Redis

  @Get('img')
  @ApiOperation({ summary: '获取登陆图片验证码' })
  async getImageCaptcha(@Query() dto: ImageCaptchaDto) {
    const { width, height } = dto

    const svg = SvgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width,
      height,
      charPreset: '1234567890',
    })
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: generateUUID(),
    }

    await this.redis.set(getCaptchaRedisKey(result.id), svg.text, 'EX', 5 * 60)

    return result
  }
}

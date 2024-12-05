import { InjectRedis } from '@/common/decorators/inject-redis.decorator'
import { ConfigKeyPaths } from '@/config'
import { ICaptchaConfig } from '@/config/captcha.config'
import { getCaptchaRedisKey } from '@/helper/getRedisKey'
import { ImageCaptcha } from '@/modules/models/auth.model'
import { generateUUID } from '@/utils'
import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import * as SvgCaptcha from 'svg-captcha'
import { ImageCaptchaDto } from '../dto/captcha.dto'

@ApiTags('Captcha - 验证码模块')
@Controller('auth/captcha')
export class CaptchaController {
  @InjectRedis() private redis: Redis
  @Inject() private configService: ConfigService<ConfigKeyPaths>

  @Get('img')
  @ApiOperation({ summary: '获取登陆图片验证码' })
  async getImageCaptcha(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    const { width, height } = dto
    const {
      captchaImgExp,
      captchaImgHeight,
      captchaImgWidth,
      captchaImgNoise: noise,
      captchaImgSize: size,
    } = this.configService.get<ICaptchaConfig>('captcha')

    const svg = SvgCaptcha.create({
      width: isEmpty(width) ? captchaImgWidth : width,
      height: isEmpty(height) ? captchaImgHeight : height,
      size,
      noise,
      color: true,
      charPreset: '1234567890',
    })
    const result = {
      img:
       `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: generateUUID(),
      // TODO: remove
      code: svg.text,
    }

    await this.redis.set(
      getCaptchaRedisKey(result.id),
      svg.text,
      'EX',
      captchaImgExp,
    )

    return result
  }
}

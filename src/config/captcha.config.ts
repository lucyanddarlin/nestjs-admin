import { envNumber } from '@/global/env'
import { ConfigType, registerAs } from '@nestjs/config'

export const CAPTCHA_REG_TOKEN = 'captcha'

export const CaptchaConfig = registerAs(CAPTCHA_REG_TOKEN, () => ({
  captchaImgWidth: envNumber('CAPTCHA_IMG_WIDTH'),
  captchaImgHeight: envNumber('CAPTCHA_IMG_HEIGHT'),
  captchaImgSize: envNumber('CAPTCHA_IMG_SIZE'),
  captchaImgNoise: envNumber('CAPTCHA_IMG_NOISE'),
  captchaImgExp: envNumber('CAPTCHA_IMG_EXP'),

}))

export type ICaptchaConfig = ConfigType<typeof CaptchaConfig>

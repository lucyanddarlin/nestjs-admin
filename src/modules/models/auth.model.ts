import { ApiProperty } from '@nestjs/swagger'

export class ImageCaptcha {
  @ApiProperty({ description: 'base64格式的 svg tup' })
  img: string

  @ApiProperty({ description: '验证码对应的唯一 ID' })
  id: string
}

export class LoginToken {
  @ApiProperty({ description: 'JWT 身份 token' })
  token: string
}

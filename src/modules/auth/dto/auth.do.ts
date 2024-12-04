import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: '帐号' })
  @IsString()
  username: string

  @ApiProperty({ description: '帐号' })
  @IsString()
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i)
  @MinLength(6)
  password: string

  @ApiProperty({ description: '语言', examples: ['EN', 'ZH'] })
  @IsString()
  lang: string
}

export class LoginDto {
  @ApiProperty({ description: '用户名/手机号/邮箱' })
  @IsString()
  username: string

  @ApiProperty({ description: '密码' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string

  @ApiProperty({ description: '验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  captchaCode: string
}

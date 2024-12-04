import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: '帐号' })
  @IsString()
  username: string

  @ApiProperty({ description: '帐号' })
  @IsString()
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i)
  @MinLength(6)
  password: string

  @ApiProperty({ description: '语音', examples: ['EN', 'ZH'] })
  @IsString()
  lang: string
}

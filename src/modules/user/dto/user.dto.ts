import { PagerDto } from '@/common/dto/pager.dto'
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsIn, IsInt, IsOptional, IsString, Matches } from 'class-validator'

export class UserDto {
  @ApiProperty({ description: '登录账号' })
  @Matches(/^[\s\S]+$/)
  @IsString()
  username: string

  @ApiProperty({ description: '登录密码' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  password: string

  @ApiProperty({ description: '归属角色' })
  @ArrayNotEmpty()
  roleIds: number[]

  @ApiProperty({ description: '归属大区' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  deptId?: number

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickName?: string

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string

  @ApiProperty({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ description: 'qq' })
  @IsOptional()
  @IsString()
  qq?: string

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiProperty({ description: '状态' })
  @IsIn([1, 2])
  status: number
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserQueryDto extends IntersectionType(PagerDto<UserDto>, PartialType(UserDto)) {
  @ApiProperty({ description: '归属大区', example: 1, required: false })
  @IsInt()
  @IsOptional()
  deptId?: number

  @ApiProperty({ description: '状态', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number
}

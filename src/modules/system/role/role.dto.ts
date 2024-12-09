import { OperatorDto } from '@/common/dto/operator.dto'
import { IsUnique } from '@/shared/database/constraints/unique.constraint'
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator'
import { RoleEntity } from './role.entity'
import { Optional } from '@nestjs/common'
import { PagerDto } from '@/common/dto/pager.dto'

export class RoleDto extends OperatorDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @MinLength(2, { message: '角色名称长度不能小于2' })
  name: string

  @ApiProperty({ description: '角色标识' })
  @IsUnique({ entity: RoleEntity })
  @IsString()
  @Matches(/^[a-z0-9]+$/i, { message: '角色标识只能包含字母和数字' })
  @MinLength(2, { message: '角色标识不能小于2' })
  value: string

  @ApiProperty({ description: '角色备注' })
  @IsString()
  @Optional()
  remark?: string

  @ApiProperty({ description: '启用状态' })
  @IsIn([0, 1])
  status: number

  @ApiProperty({ description: '关联菜单, 权限编号' })
  @IsOptional()
  @IsArray()
  menuIds: number[]
}

export class RoleUpdateDto extends PartialType(RoleDto) {}

export class RoleQueryDto extends IntersectionType(PagerDto<RoleDto>, PartialType(RoleDto)) {
  @ApiProperty({ description: '角色明琛', required: false })
  @IsString()
  name?: string

  @ApiProperty({ description: '角色值', required: false })
  @IsString()
  value?: string
}

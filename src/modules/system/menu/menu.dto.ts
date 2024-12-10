import { OperatorDto } from '@/common/dto/operator.dto'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsIn, IsInt, IsOptional, IsString, Min, MinLength, ValidateIf } from 'class-validator'

export enum MenuType {
  /** 菜单 */
  MENU = 0,
  /** 目录 */
  MENU_GROUP = 1,
  /** 权限 */
  PERMISSION = 2,
}

export const isMenu = (menu: MenuDto | Partial<MenuDto>) => menu?.type === MenuType.MENU
export const isMenuGroup = (menu: MenuDto | Partial<MenuDto>) => menu?.type === MenuType.MENU_GROUP
export const isPermission = (menu: MenuDto | Partial<MenuDto>) => menu?.type === MenuType.PERMISSION

export class MenuDto extends OperatorDto {
  @ApiProperty({
    description: `
菜单类型:
- 0: 菜单
- 1: 目录
- 2: 权限
    `,
    enum: MenuType,
  })
  @IsIn([0, 1, 2])
  type: MenuType

  @ApiProperty({ description: '父级菜单' })
  @IsOptional()
  parentId: number

  @ApiProperty({ description: '菜单或权限名称' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ description: '排序号' })
  @IsInt()
  @Min(0)
  orderNo: number

  @ApiProperty({ description: '前端路由地址' })
  @ValidateIf(o => !isPermission(o))
  path: string

  @ApiProperty({ description: '是否为外链', default: 0 })
  @ValidateIf(o => !isPermission(o))
  @IsIn([0, 1])
  isExt: number

  @ApiProperty({ description: '外链打开方式' })
  @ValidateIf((o) => {
    console.log('extOpenMode', o)
    return o.isExt === 1
  })
  @IsIn([1, 2])
  extOpenMode: number

  @ApiProperty({ description: '菜单是否展示', default: 1 })
  @ValidateIf(o => !isPermission(o))
  @IsIn([0, 1])
  show: number

  @ApiProperty({ description: '设置当前路由高亮的菜单项, 一般用于详情页' })
  @ValidateIf(o => !isPermission(o) && o.show === 0)
  @IsString()
  @IsOptional()
  activeMenu?: string

  @ApiProperty({ description: '是否开启页面缓存', default: 1 })
  @ValidateIf(o => isMenuGroup(o))
  @IsIn([0, 1])
  keepAlive: number

  @ApiProperty({ description: '状态', default: 1 })
  @IsIn([0, 1])
  status: number

  @ApiProperty({ description: '菜单图标' })
  @ValidateIf(o => !isPermission(o))
  @IsString()
  @IsOptional()
  icon?: string

  @ApiProperty({ description: '对应权限' })
  @ValidateIf(o => !isPermission(o))
  @IsString()
  @IsOptional()
  permission: string

  @ApiProperty({ description: '菜单路口路径或者外链' })
  @ValidateIf(o => !isPermission(o))
  @IsString()
  @IsOptional()
  component?: string
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}

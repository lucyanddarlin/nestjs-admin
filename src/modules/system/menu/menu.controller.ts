import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { MenuService } from './menu.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { CreatorPipe } from '@/common/pipes/creator.pipe'
import { IdParams } from '@/common/decorators/id-param.decorator'
import { UpdaterPipe } from '@/common/pipes/updater.pipe'
import { definedPermission, getDefinedPermissions, Perm } from '@/modules/auth/decorators/permission.decorator'

const permissions = definedPermission('system:menu', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('System - 菜单权限模块')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '新增菜单或者权限' })
  @Post()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) dto: MenuDto) {
    await this.menuService.check(dto)
    if (!dto.parentId) {
      dto.parentId = null
    }
    return await this.menuService.create(dto)
  }

  @ApiOperation({ summary: '获取菜单列表' })
  @Get()
  @Perm(permissions.LIST)
  async list(@Query() dto: MenuQueryDto) {
    return this.menuService.list(dto)
  }

  @ApiOperation({ summary: '获取菜单或权限信息' })
  @Get(':id')
  @Perm(permissions.READ)
  async info(@IdParams() id: number) {
    return this.menuService.getMenuItemAndParentInfo(id)
  }

  @ApiOperation({ summary: '更新菜单或者权限' })
  @Post(':id')
  @Perm(permissions.UPDATE)
  async update(@IdParams() id: number, @Body(UpdaterPipe) dto: MenuUpdateDto) {
    await this.menuService.check(dto)
    await this.menuService.update(id, dto)
  }

  @ApiOperation({ summary: '删除菜单或者权限' })
  @Delete(':id')
  @Perm(permissions.DELETE)
  async delete(@IdParams() id: number) {
    return await this.menuService.delete([id])
  }

  @Get('permissions')
  @ApiOperation({ summary: '获取服务端定义的所有权限' })
  @Perm(permissions.LIST)
  async getPermission() {
    return getDefinedPermissions()
  }
}

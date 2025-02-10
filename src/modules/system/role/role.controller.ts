import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { RoleDto, RoleQueryDto, RoleUpdateDto } from './role.dto'
import { IdParams } from '@/common/decorators/id-param.decorator'
import { UpdaterPipe } from '@/common/pipes/updater.pipe'
import { definedPermission, Perm } from '@/modules/auth/decorators/permission.decorator'

const permission = definedPermission('system:role', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('System - 角色模块')
@ApiSecurityAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '新增角色' })
  @Post()
  @Perm(permission.CREATE)
  async create(@Body() dto: RoleDto) {
    return await this.roleService.create(dto)
  }

  @ApiOperation({ summary: '获取角色列表' })
  @Get()
  @Perm(permission.LIST)
  async list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto)
  }

  @ApiOperation({ summary: '获取角色信息' })
  @Get(':id')
  @Perm(permission.READ)
  async info(@IdParams() id: number) {
    return this.roleService.info(id)
  }

  @ApiOperation({ summary: '更新角色' })
  @Put(':id')
  @Perm(permission.UPDATE)
  async update(@IdParams() id: number, @Body(UpdaterPipe) dto: RoleUpdateDto) {
    return this.roleService.update(id, dto)
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete(':id')
  @Perm(permission.DELETE)
  async delete(@IdParams() id: number) {
    return this.roleService.delete(id)
  }
}

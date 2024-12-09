import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { RoleDto, RoleQueryDto, RoleUpdateDto } from './role.dto'
import { IdParams } from '@/common/decorators/id-param.decorator'
import { UpdaterPipe } from '@/common/pipes/updater.pipe'

@ApiTags('System - 角色模块')
@ApiSecurityAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '新增角色' })
  async create(@Body() dto: RoleDto) {
    return await this.roleService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  async list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色信息' })
  async info(@IdParams() id: number) {
    return this.roleService.info(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  async update(@IdParams() id: number, @Body(UpdaterPipe) dto: RoleUpdateDto) {
    return this.roleService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  async delete(@IdParams() id: number) {
    return this.roleService.delete(id)
  }
}

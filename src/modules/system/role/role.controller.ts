import { Body, Controller, Post } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { RoleDto } from './role.dto'

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
}

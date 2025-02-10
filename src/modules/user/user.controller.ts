import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { MenuService } from '../system/menu/menu.service'
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto'
import { IdParams } from '@/common/decorators/id-param.decorator'
import { definedPermission, Perm } from '../auth/decorators/permission.decorator'

const permission = definedPermission('system:user', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
})

@ApiTags('System - 用户模块')
@ApiSecurityAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
  ) {}

  @ApiOperation({ summary: '新增用户' })
  @Post()
  @Perm(permission.CREATE)
  async create(@Body() dto: UserDto) {
    await this.userService.create(dto)
  }

  @ApiOperation({ summary: '更新用户' })
  @Put(':id')
  @Perm(permission.UPDATE)
  async update(@IdParams() id: number, @Body() dto: UserUpdateDto) {
    await this.userService.update(id, dto)
    // TODO: refresh perm
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  @Perm(permission.DELETE)
  async delete(@Param('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    await this.userService.delete(ids)
  }

  @ApiOperation({ summary: '查询用户' })
  @Get(':id')
  @Perm(permission.READ)
  async info(@IdParams() id: number) {
    return await this.userService.info(id)
  }

  @ApiOperation({ summary: '获取用户列表' })
  @Get()
  @Perm(permission.LIST)
  async list(@Query() dto: UserQueryDto) {
    return await this.userService.list(dto)
  }
}

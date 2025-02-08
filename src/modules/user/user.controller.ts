import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { MenuService } from '../system/menu/menu.service'
import { UserDto } from './dto/user.dto'

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
  async create(@Body() dto: UserDto) {
    await this.userService.create(dto)
  }
}

import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { MenuService } from './menu.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@/common/decorators/swagger.decorator'
import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { CreatorPipe } from '@/common/pipes/creator.pipe'
import { IdParams } from '@/common/decorators/id-param.decorator'
import { UpdaterPipe } from '@/common/pipes/updater.pipe'

@ApiTags('System - 菜单权限模块')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '新增菜单或者权限' })
  @Post()
  async create(@Body(CreatorPipe) dto: MenuDto) {
    await this.menuService.check(dto)
    if (!dto.parentId) {
      dto.parentId = null
    }
    return await this.menuService.create(dto)
  }

  @Get()
  async list(@Query() dto: MenuQueryDto) {
    return this.menuService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单或权限信息' })
  async info(@IdParams() id: number) {
    return this.menuService.getMenuItemAndParentInfo(id)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新菜单或者权限' })
  async update(@IdParams() id: number, @Body(UpdaterPipe) dto: MenuUpdateDto) {
    await this.menuService.check(dto)
    await this.menuService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单或者权限' })
  async delete(@IdParams() id: number) {
    return await this.menuService.delete([id])
  }
}

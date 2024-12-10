import { Injectable } from '@nestjs/common'
import { isMenuGroup, isPermission, MenuDto, MenuUpdateDto } from './menu.dto'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { InjectRepository } from '@nestjs/typeorm'
import { MenuEntity } from './menu.entity'
import { Repository } from 'typeorm'
import { isEmpty } from 'lodash'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity) private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  /**
   * @description 检查菜单创建是否符合规则
   */
  async check(dto: Partial<MenuDto>) {
    if (isPermission(dto) && !dto.parentId) {
      throw new BusinessException(ErrorEnum.PERMISSION_REQUIRES_PARENT)
    }
    if (isMenuGroup(dto) && dto.parentId) {
      const parent = await this.getMenuItemInfo(dto.parentId)
      if (isEmpty(parent)) {
        throw new BusinessException(ErrorEnum.PARENT_MENU_NOT_FOUND)
      }
      if (parent && isMenuGroup(parent)) {
        throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION_DIRECTORY_PARENT)
      }
    }
  }

  /**
   * @description 创建菜单或者权限
   */
  async create(dto: MenuDto) {
    const menu = await this.menuRepository.save(dto)
    return menu
  }

  /**
   * 获取某个菜单以及关联父级菜单的信息
   */
  async getMenuItemAndParentInfo(id: number) {
    const menu = await this.menuRepository.findOneBy({ id })
    let parentMenu: MenuEntity | undefined
    if (menu && menu.parentId) {
      parentMenu = await this.menuRepository.findOneBy({ id: menu.parentId })
    }
    return { menu, parentMenu }
  }

  /**
   * @description 更新菜单
   */
  async update(id: number, menu: MenuUpdateDto) {
    await this.menuRepository.update(id, menu)
  }

  /**
   * @description 删除菜单或者权限
   */
  async delete(ids: number[]) {
    await this.menuRepository.delete(ids)
  }

  /**
   * @description 获取单个菜单的信息
   */
  async getMenuItemInfo(mid: number) {
    return this.menuRepository.findOneBy({ id: mid })
  }
}

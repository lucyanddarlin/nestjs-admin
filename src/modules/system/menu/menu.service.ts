import { Injectable } from '@nestjs/common'
import { isMenuGroup, isPermission, MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { InjectRepository } from '@nestjs/typeorm'
import { MenuEntity } from './menu.entity'
import { In, IsNull, Like, Not, Repository } from 'typeorm'
import { concat, isEmpty, isNil, uniq } from 'lodash'
import { deleteEmptyChildren } from '@/utils/listToTree.util'
import { generatorMenu } from '@/utils/permission.util'
import { RoleService } from '../role/role.service'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity) private readonly menuRepository: Repository<MenuEntity>,
    private readonly roleService: RoleService,
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
   * @description 获取菜单列表
   */
  async list({ name, path, permission, component, status }: MenuQueryDto): Promise<MenuEntity[]> {
    const menus = await this.menuRepository.find({
      where: {
        ...(name && { name: Like(`%${name}%`) }),
        ...(path && { path: Like(`%${path}%`) }),
        ...(permission && { permission: Like(`%${permission}%`) }),
        ...(component && { component: Like(`%${component}%`) }),
        ...(!isNil(status) ? { status } : null),
      },
      order: { orderNo: 'ASC' },
    })
    const menuList = generatorMenu(menus)
    if (!isEmpty(menuList)) {
      deleteEmptyChildren(menuList)
      return menuList
    }
    return menus
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

  /**
   * @description 获取当前用户的权限
   */
  async getUserPermissions(uid: number) {
    const roleIds = await this.roleService.getRoleIdsByUser(uid)
    let permission: any[] = []
    let result: any[] = []
    if (this.roleService.hasAdminRole(roleIds)) {
      result = await this.menuRepository.findBy({
        permission: Not(IsNull()),
        type: In([1, 2]),
      })
    } else {
      if (isEmpty(roleIds)) {
        return permission
      }
      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect('menu.roles', 'role')
        .andWhere('role.id IN (:...roleIds)', { roleIds })
        .andWhere('menu.type IN (1,2)')
        .andWhere('menu.permission IS NOT NULL')
        .getMany()
    }
    if (!isEmpty(result)) {
      result.forEach((e) => {
        if (e.permission) {
          permission = concat(permission, e.permission.split(','))
        }
      })
      permission = uniq(permission)
    }
    return permission
  }
}

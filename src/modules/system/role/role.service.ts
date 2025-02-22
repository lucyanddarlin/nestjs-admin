import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { EntityManager, In, Like, Repository } from 'typeorm'
import { RoleDto, RoleQueryDto, RoleUpdateDto } from './role.dto'
import { MenuEntity } from '../menu/menu.entity'
import { Pagination } from '@/helper/paginate/pagination'
import { isEmpty, isNil } from 'lodash'
import { paginate } from '@/helper/paginate'
import { SUPER_ADMIN_ROLE_ID } from '@/constant/system.constant'
import { ErrorEnum } from '@/constant/error-code.constant'
import { BusinessException } from '@/common/exceptions/business.exception'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity) private readonly menuRepository: Repository<MenuEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  /**
   * @description 创建角色
   */
  async create({ menuIds, ...data }: RoleDto): Promise<{ roleId: RoleEntity['id'] }> {
    const role = await this.roleRepository.save({
      ...data,
      menus: menuIds
        ? await this.menuRepository.findBy({ id: In(menuIds) })
        : [],
    })

    return { roleId: role.id }
  }

  /**
   * @description 查询角色列表
   */
  async list(params: RoleQueryDto): Promise<Pagination<RoleEntity>> {
    const { page, pageSize, name, value, remark, status } = params
    const queryBuilder = await this.roleRepository.createQueryBuilder('role')
      .where({
        ...(name ? { name: Like(`%${name}%`) } : null),
        ...(value ? { value: Like(`%${value}%`) } : null),
        ...(remark ? { remark: Like(`%${remark}%`) } : null),
        ...(!isNil(status) ? { status } : null),
      })

    return paginate(queryBuilder, { page, pageSize })
  }

  /**
   * @description 查询角色信息
   */
  async info(id: number) {
    const info = await this.roleRepository
      .createQueryBuilder('role')
      .where({ id })
      .getOne()

    const menus = await this.menuRepository.find({
      where: { roles: { id } },
      select: ['id'],
    })

    return { ...info, menuIds: menus.map(m => m.id) }
  }

  /**
   * @description 更新角色信息
   */
  async update(id: number, { menuIds, ...data }: RoleUpdateDto) {
    await this.roleRepository.update(id, data)
    await this.entityManager.transaction(async (manager) => {
      const role = await this.roleRepository.findOne({ where: { id } })
      role.menus = menuIds.length > 0 ? await this.menuRepository.findBy({ id: In(menuIds) }) : []
      await manager.save(role)
    })
  }

  /**
   * @description 删除角色
   */
  async delete(id: number) {
    if (id === SUPER_ADMIN_ROLE_ID) {
      throw new BusinessException(ErrorEnum.CANNOT_DELETE_SUPER_ADMIN)
    }
    await this.roleRepository.delete(id)
  }

  /**
   * @description 根据用户 id 查询角色id
   */
  async getRoleIdsByUser(id: number) {
    const roles = await this.roleRepository.find({
      where: { users: { id } },
    })
    return !isEmpty(roles) ? roles.map(r => r.id) : []
  }

  async getRoleValues(ids: number[]) {
    return (await this.roleRepository.findBy({
      id: In(ids),
    })).map(r => r.value)
  }

  hasAdminRole(rids: number[]) {
    return rids.includes(SUPER_ADMIN_ROLE_ID)
  }
}

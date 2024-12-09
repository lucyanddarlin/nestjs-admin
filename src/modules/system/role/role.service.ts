import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { EntityManager, In, Like, Repository } from 'typeorm'
import { RoleDto, RoleQueryDto } from './role.dto'
import { MenuEntity } from '../menu/menu.entity'
import { Pagination } from '@/helper/paginate/pagination'
import { isNil } from 'lodash'
import { paginate } from '@/helper/paginate'

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
}

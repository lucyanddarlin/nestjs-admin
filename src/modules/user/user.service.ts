import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { UserStatus } from '@/constant/user.constant'
import { md5 } from '@/utils/crypto.util'
import { randomValue } from '@/utils/tool.util'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, In, Like, Repository } from 'typeorm'
import { RegisterDto } from '../auth/dto/auth.do'
import { UserEntity } from './entity/user.entity'
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto'
import { RoleEntity } from '../system/role/role.entity'
import { SUPER_ADMIN_USER_ID } from '@/constant/system.constant'
import { paginate } from '@/helper/paginate'
import { Pagination } from '@/helper/paginate/pagination'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  @InjectRepository(RoleEntity)
  private readonly roleRepository: Repository<RoleEntity>

  @InjectEntityManager() private entityManager: EntityManager

  /**
   * @description 根据名称查找用户
   */
  async findUserByName(username: string): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        username,
        status: UserStatus.ENABLE,
      })
      .getOne()
  }

  /**
   * @description 创建用户
   */
  async create({ username, password, roleIds, ...data }: UserDto) {
    const exists = await this.userRepository.findOneBy({ username })
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS)
    }
    await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32)

      if (!password) {
        // TODO: paramsConfigService
        const initPassword = 12345
        password = md5(`${initPassword ?? '12345'}${salt}`)
      } else {
        password = md5(`${password ?? '12345'}${salt}`)
      }
      const u = manager.create(UserEntity, {
        username,
        password,
        ...data,
        psalt: salt,
        roles: await this.roleRepository.findBy({ id: In(roleIds) }),
      })
      return await manager.save(u)
    })
  }

  /**
   * @description 更新用户信息
   */
  async update(id: number, { password, deptId, roleIds, status, ...data }: UserUpdateDto) {
    await this.entityManager.transaction(async (manager) => {
      if (password) {
        console.log('force update password')
      }

      await manager.update(UserEntity, id, {
        ...data,
        status,
      })

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .where('user.id = :id', { id })
        .getOne()

      if (roleIds) {
        await manager
          .createQueryBuilder()
          .relation(UserEntity, 'roles')
          .of(id)
          .addAndRemove(roleIds, user.roles)
      }

      if (status === UserStatus.DISABLE) {
        console.log('ready to disable user')
      }
    })
  }

  /**
   * @description 删除用户
   */
  async delete(ids: number[]) {
    if (ids.includes(SUPER_ADMIN_USER_ID)) {
      throw new BusinessException(ErrorEnum.CANNOT_DELETE_SUPER_ADMIN)
    }
    await this.userRepository.delete(ids)
  }

  /**
   * @description 查询用户信息
   */
  async info(id: number) {
    const { password, psalt, ...rest } = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id })
      .getOne()

    return rest
  }

  /**
   * @description 获取用户列表
   */
  async list(
    { page, pageSize, username, nickName, email, status }: UserQueryDto,
  ): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where({
        ...(username ? { username: Like(`%${username}%`) } : null),
        ...(nickName ? { nickName: Like(`%${nickName}%`) } : null),
        ...(email ? { email: Like(`%${email}%`) } : null),
        ...(!isNil(status) ? { status } : null),
      })

    return paginate<UserEntity>(queryBuilder, { page, pageSize })
  }

  /**
   * @description 注册帐号
   */
  async register({ username, ...data }: RegisterDto) {
    const exist = await this.userRepository.findOneBy({ username })
    if (!isEmpty(exist)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS)
    }

    return await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32)
      const password = md5(`${data.password}${salt}`)
      const u = manager.create(UserEntity, {
        username,
        password,
        psalt: salt,
      })
      return await manager.save(u)
    })
  }
}

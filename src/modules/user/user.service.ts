import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { UserStatus } from '@/constant/user.constant'
import { md5 } from '@/utils/crypto.util'
import { randomValue } from '@/utils/tool.util'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, In, Repository } from 'typeorm'
import { RegisterDto } from '../auth/dto/auth.do'
import { UserEntity } from './entity/user.entity'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

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
        roles: await this.userRepository.findBy({ id: In(roleIds) }),
      })
      return await manager.save(u)
    })
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

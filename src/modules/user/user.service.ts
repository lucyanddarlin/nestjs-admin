import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { md5 } from '@/utils/crypto.util'
import { randomValue } from '@/utils/tool.util'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, Repository } from 'typeorm'
import { RegisterDto } from '../auth/dto/auth.do'
import { UserEntity } from './entity/user.entity'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  @InjectEntityManager() private entityManager: EntityManager

  /**
   * @description 注册帐号
   */
  async register({ username, ...data }: RegisterDto) {
    const exists = await this.userRepository.findOneBy({ username })
    if (!isEmpty(exists)) {
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS)
    }

    return await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32)
      const password = md5(`${data.password}${salt}`)
      const u = manager.create(UserEntity, {
        username,
        password,
        paslt: salt,
        status: 1,
      })
      return await manager.save(u)
    })
  }
}

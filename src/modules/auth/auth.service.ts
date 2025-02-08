import { InjectRedis } from '@/common/decorators/inject-redis.decorator'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ISecurityConfig, SecurityConfig } from '@/config/security.config'
import { ErrorEnum } from '@/constant/error-code.constant'
import { getAuthTokenKey } from '@/helper/getRedisKey'
import { md5 } from '@/utils'
import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import { UserService } from '../user/user.service'
import { TokenService } from './services/token.service'
import { MenuService } from '../system/menu/menu.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(SecurityConfig.KEY) private readonly securityConfig: ISecurityConfig,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly menuService: MenuService,
  ) {}

  /**
   * @description 登陆前验证
   */
  async validateUser(username: string, pwd: string) {
    const existsUser = await this.userService.findUserByName(username)
    if (isEmpty(existsUser)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    const comparePwd = md5(`${pwd}${existsUser.psalt}`)
    if (existsUser.password !== comparePwd) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    }

    const { password, ...result } = existsUser
    return result
  }

  /**
   * @description 登陆
   */
  async login(
    username: string,
    password: string,
    _ip?: string,
    _ua?: string,
  ) {
    const existUser = await this.userService.findUserByName(username)
    if (isEmpty(existUser)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    const comparePwd = md5(`${password}${existUser.psalt}`)
    if (comparePwd !== existUser.password) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    }

    const token = await this.tokenService.generateAccessToken(existUser.id, [])
    await this.redis.set(
      getAuthTokenKey(existUser.id),
      token.accessToken,
      'EX',
      this.securityConfig.jwtExpire,
    )

    return token.accessToken
  }

  /**
   * @description 获取用户权限
   */
  async getUserPermission(uid: number) {
    return this.menuService.getUserPermissions(uid)
  }
}

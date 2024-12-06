import { InjectRedis } from '@/common/decorators/inject-redis.decorator'
import { ISecurityConfig, SecurityConfig } from '@/config/security.config'
import { UserEntity } from '@/modules/user/entity/user.entity'
import { generateUUID } from '@/utils'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'
import Redis from 'ioredis'
import { AccessTokenEntity } from '../entity/access-token.entity'
import { RefreshTokenEntity } from '../entity/refresh-token.entity'

@Injectable()
export class TokenService {
  constructor(
    @InjectRedis() private redis: Redis,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private jwtService: JwtService,

  ) {}

  /**
   * @description 生成 AccessToken
   */
  async generateAccessToken(uid: number, roles: string[]) {
    const payload: IAuthUser = {
      uid,
      pv: 1,
      roles,
    }
    const jwtSign = await this.jwtService.signAsync(payload)
    const accessToken = new AccessTokenEntity()
    accessToken.value = jwtSign
    accessToken.user = { id: uid } as UserEntity
    accessToken.expired_at = dayjs()
      .add(this.securityConfig.jwtExpire, 'second')
      .toDate()

    await accessToken.save()

    const refreshToken = await this.generateRefreshToken(accessToken, dayjs())

    return {
      accessToken: jwtSign,
      refreshToken,
    }
  }

  /**
   * @description 生成 RefreshToken
   */
  async generateRefreshToken(accessToken: AccessTokenEntity, now: dayjs.Dayjs) {
    const refreshTokenPayLoad = { uuid: generateUUID() }
    const refreshTokenSign = await this.jwtService.signAsync(
      refreshTokenPayLoad,
      {
        secret: this.securityConfig.refreshSecret,
      },
    )
    const refreshToken = new RefreshTokenEntity()
    refreshToken.value = refreshTokenSign
    refreshToken.expired_at = now
      .add(this.securityConfig.refreshExpire, 'second')
      .toDate()
    refreshToken.accessToken = accessToken

    await refreshToken.save()

    return refreshTokenSign
  }

  /**
   * @description 检查 AccessToken 是否存在, 并且是否处于有效期内
   */
  async checkAccessToken(value: string) {
    let isValid = false
    try {
      await this.verifyAccessToken(value)
      const res = await AccessTokenEntity.findOne({
        where: { value },
        relations: ['user', 'refreshToken'],
      })
      isValid = Boolean(res)
    } catch {

    }
    return isValid
  }

  /**
   * @description 验证 token 是否正确, 如果正确则返回所属用户对象
   */
  async verifyAccessToken(token: string): Promise<IAuthUser> {
    return this.jwtService.verifyAsync(token)
  }
}

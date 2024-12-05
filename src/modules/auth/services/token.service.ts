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
    private jwtService: JwtService,
     @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,

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
}

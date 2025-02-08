import { isDev } from '@/global/env'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { ISecurityConfig, SECURITY_REG_TOKEN } from '@/config/security.config'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaController } from './controllers/captcha.controller'
import { AccessTokenEntity } from './entity/access-token.entity'
import { RefreshTokenEntity } from './entity/refresh-token.entity'
import { CaptchaService } from './services/captcha.service'
import { TokenService } from './services/token.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MenuModule } from '../system/menu/menu.module'
import { RoleModule } from '../system/role/role.module'

const controllers = [AuthController, CaptchaController]
const providers = [AuthService, CaptchaService, TokenService]

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configServer: ConfigService) {
        const { jwtSecret, jwtExpire } = configServer.get<ISecurityConfig>(SECURITY_REG_TOKEN)
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExpire}s`,
          },
          ignoreExpiration: isDev,
        }
      },
    }),
    UserModule,
    MenuModule,
    RoleModule,
  ],
  controllers,
  providers: [...providers, JwtStrategy],
  exports: [...providers, TypeOrmModule, JwtModule],
})
export class AuthModule {}

import { ISecurityConfig, SECURITY_REG_TOKEN } from '@/config/security.config'
import { isDev } from '@/global/env'
import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaController } from './controllers/captcha.controller'
import { AccessTokenEntity } from './entity/access-token.entity'
import { RefreshTokenEntity } from './entity/refresh-token.entity'
import { CaptchaService } from './services/captcha.service'
import { TokenService } from './services/token.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
    PassportModule,
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
  ],
  controllers: [AuthController, CaptchaController],
  providers: [AuthService, CaptchaService, TokenService],
})
export class AuthModule {}

import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaController } from './controllers/captcha.controller'

@Module({
  imports: [UserModule],
  controllers: [AuthController, CaptchaController],
  providers: [AuthService],
})
export class AuthModule {}

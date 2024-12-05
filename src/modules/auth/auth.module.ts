import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaController } from './controllers/captcha.controller'
import { CaptchaService } from './services/captcha.service'

@Module({
  imports: [UserModule],
  controllers: [AuthController, CaptchaController],
  providers: [AuthService, CaptchaService],
})
export class AuthModule {}

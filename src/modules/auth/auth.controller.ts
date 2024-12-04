import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/auth.do'

@ApiTags('Auth - 认证模块')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  async login(@Body() dto: LoginDto) {
    return dto
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto): Promise<any> {
    return this.userService.register(dto)
  }
}

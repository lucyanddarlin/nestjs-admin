import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'
import { md5 } from '@/utils'
import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

  ) {}

  /**
   * @description 登陆前验证
   */
  async validateUser(username: string, pwd: string) {
    const existsUser = await this.userService.findUserByName(username)
    if (isEmpty(existsUser)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    const comparePwd = md5(`${pwd}${existsUser.paslt}`)
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
    ip?: string,
    ua?: string,
  ) {
    const existUser = await this.userService.findUserByName(username)
    if (isEmpty(existUser)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    const comparePwd = md5(`${password}${existUser.paslt}`)
    if (comparePwd !== existUser.password) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    }

    return 'token'
  }
}

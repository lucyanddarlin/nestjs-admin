import { BusinessException } from '@/common/exceptions/business.exception'
import { RouterWhiteList } from '@/config'
import { ErrorEnum } from '@/constant/error-code.constant'
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { isEmpty, isNil } from 'lodash'
import { ExtractJwt } from 'passport-jwt'
import { TokenService } from '../services/token.service'

/** @type {import('fastify').RequestGenericInterface} */
interface RequestType {
  Params: {
    uid?: string
  }
  Querystring: {
    token: string
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken()

  constructor(
    private readonly tokenService: TokenService,

  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest<RequestType>>()
    if (RouterWhiteList.includes(request.routeOptions.url)) {
      return true
    }

    const token = this.jwtFromRequestFn(request)
    let result: any = false
    request.accessToken = token

    try {
      result = await super.canActivate(context)
    } catch (error) {
      if (isEmpty(token)) {
        throw new BusinessException(ErrorEnum.EMPTY_TOKEN)
      }
      if (error instanceof UnauthorizedException) {
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }

      const isValid = isNil(token) ? undefined : await this.tokenService.checkAccessToken(token)
      if (!isValid) {
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }
    }

    return result
  }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { AuthService } from '../auth.service'
import { PERMISSION_KEY, PUBLIC_KEY, Roles } from '@/constant/auth.constant'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ErrorEnum } from '@/constant/error-code.constant'

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean > {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const { user } = request
    if (!user) {
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    if (user.roles.includes(Roles.ADMIN)) {
      return true
    }
    // TODO: allowAnon
    // const allowAnon = true
    const payloadPermission = this.reflector.getAllAndOverride<string | string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!payloadPermission) {
      return true
    }

    const allPermissions = await this.authService.getUserPermission(user.uid)
    let canNext = false

    if (Array.isArray(payloadPermission)) {
      canNext = payloadPermission.some(p => allPermissions.includes(p))
    } else if (typeof payloadPermission === 'string') {
      canNext = allPermissions.includes(payloadPermission)
    }

    if (!canNext) {
      throw new BusinessException(ErrorEnum.NO_PERMISSION)
    }

    return true
  }
}

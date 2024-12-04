import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import qs from 'qs'
import { map, Observable } from 'rxjs'
import { ResOp } from '../model/response.model'

/**
 * 统一处理接口请求与响应数据
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // TODO: bypass
    if (false) {
      return next.handle()
    }
    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()

    // ?a[]=1&a[]=2 ==> {a: [1,2]}
    request.query = qs.parse(request.url.split('?').at(1))

    return next.handle().pipe(
      map(data => new ResOp(HttpStatus.OK, data ?? null)),
    )
  }
}

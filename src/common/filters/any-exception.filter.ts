import { ErrorEnum } from '@/constant/error-code.constant'
import { isDev } from '@/global/env'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { QueryFailedError } from 'typeorm'
import { BusinessException } from '../exceptions/business.exception'

interface MyError {
  readonly status: number
  readonly statusCode?: number
  readonly message?: string
}

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name)

  constructor() {
    this.registerCatchAllExceptionHook()
  }

  private registerCatchAllExceptionHook() {
    // promise reject but don't be caught
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection: ', reason)
    })
    // throw new Error()
    process.on('uncaughtException', (error) => {
      console.error('uncaughtException: ', error)
    })
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()
    const url = request.raw.url
    const status = this.getStatus(exception)
    let message = this.getErrorMessage(exception)

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && !(exception instanceof BusinessException)) {
      // 内部错误
      Logger.error(exception, undefined, 'Catch')
      if (!isDev) {
        message = ErrorEnum.SERVER_ERROR.split(':')[1]
      } else {
        this.logger.warn(`错误信息: (${status}) ${message} Path: ${decodeURI(url)}`)
      }
    }

    const apiErrorCode = exception instanceof BusinessException ? exception.getErrorCode() : status
    const resBody: IBaseResponse = {
      code: apiErrorCode,
      message,
      data: null,
    }

    response.status(status).send(resBody)
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR
    } else {
      return (exception as MyError)?.status
        ?? (exception as MyError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getErrorMessage(exception): string {
    if (exception instanceof HttpException) {
      return exception.message
    } else if (exception instanceof QueryFailedError) {
      return exception.message
    } else {
      return (exception as any)?.response?.message
        ?? (exception as MyError)?.message ?? `${exception}`
    }
  }
}

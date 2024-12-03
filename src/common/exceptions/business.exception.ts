import { ErrorEnum } from '@/constant/error-code.constant'
import { RESPONSE_SUCCESS_CODE } from '@/constant/response.constant'
import { HttpException, HttpStatus } from '@nestjs/common'

export class BusinessException extends HttpException {
  private errorCode: number

  constructor(error: ErrorEnum | string) {
    if (!error.includes(':')) {
      super(
        HttpException.createBody({
          code: RESPONSE_SUCCESS_CODE,
          message: error,
        }),
        HttpStatus.OK,
      )
      this.errorCode = RESPONSE_SUCCESS_CODE
    } else {
      const [code, message] = error.split(':')
      super(HttpException.createBody({
        code,
        message,
      }), HttpStatus.OK)
      this.errorCode = Number(code)
    }
  }

  getErrorCode(): number {
    return this.errorCode
  }
}

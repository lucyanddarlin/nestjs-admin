import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    throw new Error('test - error')
    return 'Hello World!'
  }
}

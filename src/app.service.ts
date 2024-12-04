import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('hello world')
      }, 8 * 1000)
    })
    setTimeout(() => {
      return 'Hello World!'
    }, 4 * 1000)
  }
}

import { ArgumentMetadata, Inject, PipeTransform } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

export class UpdaterPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: any,
  ) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const user = this.request.user as IAuthUser
    value.updatedBy = user.uid

    return value
  }
}

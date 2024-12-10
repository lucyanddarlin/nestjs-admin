import { ArgumentMetadata, Inject, PipeTransform } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

export class CreatorPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: any,
  ) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const user = this.request.user as IAuthUser
    value.createdBy = user.uid

    return value
  }
}

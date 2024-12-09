import { ApiHideProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class OperatorDto {
  @ApiHideProperty()
  @Exclude()
  createdBy: number

  @ApiHideProperty()
  @Exclude()
  updatedBy: number
}

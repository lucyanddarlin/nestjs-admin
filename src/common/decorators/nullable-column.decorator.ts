import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'

export function NullableColumn(options: ColumnOptions = {}) {
  return applyDecorators(Column({ ...options, nullable: true }))
}

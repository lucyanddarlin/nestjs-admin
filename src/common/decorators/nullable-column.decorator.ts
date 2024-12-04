import { Column, ColumnOptions } from 'typeorm'

export function NullableColumn(options: ColumnOptions = {}) {
  return Column({ ...options, nullable: true })
}

import { Column, ColumnOptions } from 'typeorm'

export const NullableColumn = (options: ColumnOptions = {}) => Column({ ...options, nullable: true })

import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { Allow, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class PagerDto<T = any> {
  @ApiProperty({ minimum: 1, default: 1 })
  @Min(1)
  @IsInt()
  @Expose()
  @IsOptional({ always: true })
  @Transform(({ value }) => (value ? Number.parseInt(value) : 1), { toClassOnly: true })
  page?: number

  @ApiProperty({ minimum: 1, maximum: 100, default: 10 })
  @Min(1)
  @Max(100)
  @IsInt()
  @Expose()
  @IsOptional({ always: true })
  @Transform(({ value }) => (value ? Number.parseInt(value) : 100), { toClassOnly: true })
  pageSize?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  field?: keyof T

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === 'asc' ? Order.ASC : Order.DESC))
  order?: Order

  @Allow()
  _t?: number
}

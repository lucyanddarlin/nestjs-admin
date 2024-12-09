import { ObjectLiteral } from 'typeorm'

export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface IPaginationOptions {
  page: number
  pageSize: number
  paginationType?: PaginationTypeEnum
}

export interface IPaginationMeat extends ObjectLiteral {
  itemCount: number
  totalItems?: number
  itemsPerPge: number
  totalPage?: number
  currentPage: number
}

export interface IPaginationLinks {
  first?: string
  pervious?: string
  next?: string
  last?: string
}

import { IPaginationMeat } from './interface'
import { Pagination } from './pagination'

interface Params<T> {
  items: T[]
  totalItems: number
  currentPage: number
  limit: number
}

export function createPaginationObject<T>(params: Params<T>): Pagination<T> {
  const { items, totalItems, currentPage, limit } = params
  const totalPages = totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined
  const meta: IPaginationMeat = {
    totalItems,
    itemCount: items.length,
    itemsPerPge: limit,
    totalPages,
    currentPage,
  }

  return new Pagination<T>(items, meta)
}

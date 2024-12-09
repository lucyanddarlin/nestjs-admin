import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'
import { Pagination } from './pagination'
import { IPaginationOptions, PaginationTypeEnum } from './interface'
import { createPaginationObject } from './create-pagination'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

function resolveOptions(options: IPaginationOptions): [number, number, PaginationTypeEnum] {
  const { page, pageSize, paginationType } = options
  return [
    page || DEFAULT_PAGE,
    pageSize || DEFAULT_LIMIT,
    paginationType || PaginationTypeEnum.TAKE_AND_SKIP,
  ]
}

async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options)
  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions,
    }),
    repository.count(searchOptions),
  ]

  const [items, total] = await Promise.all(promises)
  return createPaginationObject({ items, totalItems: total, currentPage: page, limit })
}

async function paginate<T extends ObjectLiteral >(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
): Promise<Pagination<T>>
async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions
): Promise<Pagination<T>>
async function paginate<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository(repositoryOrQueryBuilder, options, searchOptions)
    : {} as Promise<Pagination<T>>
}

export { paginate }

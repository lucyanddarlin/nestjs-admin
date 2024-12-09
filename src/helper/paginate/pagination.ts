import { ObjectLiteral } from 'typeorm'

export class Pagination<PaginationObject, T extends ObjectLiteral = any> {
  constructor(
    public readonly items: PaginationObject[],
    public readonly meta: T,
  ) {}
}

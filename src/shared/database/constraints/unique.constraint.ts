import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator'
import { isNil, merge } from 'lodash'
import { ClsService } from 'nestjs-cls'
import { DataSource, Not, ObjectType } from 'typeorm'

interface Condition {
  entity: ObjectType<any>
  filed?: string
  message?: string
}

export class UniqueConstraints implements ValidatorConstraintInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  async validate(value: any, arg?: ValidationArguments): Promise<boolean> {
    const config: Omit<Condition, 'entity'> = {
      filed: arg.property,
    }

    const condition: Required<Condition> = 'entity' in arg.constraints[0]
      ? merge(config, arg.constraints[0])
      : { ...config, entity: arg.constraints[0] }

    if (!condition.entity) {
      return false
    }

    try {
      const repo = this.dataSource.getRepository(condition.entity)
      if (!condition.message) {
        const targetColumn = repo.metadata.columns.find(n => n.propertyName === condition.filed)
        if (targetColumn?.comment) {
          arg.constraints[0].message = `已存在相同的${targetColumn.comment}`
        }
      }

      let andWhere = {}
      const operateId = this.cls.get('operateId')
      if (Number.isInteger(operateId)) {
        andWhere = { id: Not(operateId) }
      }
      return isNil(
        await repo.findOne({ where: { [condition.filed]: value, ...andWhere } }),
      )
    } catch {
      return false
    }
  }

  defaultMessage?(arg?: ValidationArguments): string {
    const { entity, filed, message } = arg.constraints[0] as Condition
    const queryProperty = filed ?? arg.property

    if (!entity) {
      return 'Model is not been specified'
    }

    return message || `${queryProperty} of ${entity.name} must be unique`
  }
}

function IsUnique(
  entity: Condition['entity'],
  validationOptions?: ValidationOptions
): (obj: Record<string, any>, propertyName: string) => void
function IsUnique(
  entity: Condition,
  validationOptions?: ValidationOptions
): (obj: Record<string, any>, propertyName: string) => void
function IsUnique(
  params: Condition['entity'] | Condition,
  validationOptions?: ValidationOptions,
): (obj: Record<string, any>, propertyName: string) => void {
  return (obj, propertyName) => {
    registerDecorator({
      propertyName,
      target: obj.constructor,
      options: validationOptions,
      constraints: [params],
      validator: UniqueConstraints,
    })
  }
}

export { IsUnique }

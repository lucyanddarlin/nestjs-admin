import { PERMISSION_KEY } from '@/constant/auth.constant'
import { applyDecorators, SetMetadata } from '@nestjs/common'
import { isPlainObject } from 'lodash'

type AddPrefixToObjectValue<T extends string, P extends Record<string, string>> = {
  [K in keyof P]: K extends string ? `${T}:${P[K]}` : never
}
type TupleToObject<T extends string, U extends Readonly<string[]>> = {
  [K in Uppercase<U[number]>]: `${T}:${Lowercase<K>}`
}

/**
 * @description 权限装饰器
 */
export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission))
}

let permission: string[] = []

/**
 * @description 定义权限, 同时收集所有被定义的权限
 */
export function definedPermission<
  T extends string,
  U extends Record<string, string>,
>(modulePrefix: T, actionMap: U): AddPrefixToObjectValue<T, U>
export function definedPermission<
  T extends string,
  U extends Readonly<string[]>,
>(modulePrefix: T, actions: U): TupleToObject<T, U>
export function definedPermission(modulePrefix: string, actions) {
  if (isPlainObject(actions)) {
    Object.entries(actions).forEach(([key, action]) => {
      actions[key] = `${modulePrefix}:${action}`
    })
    permission = [...new Set([...permission, ...Object.values<string>(actions)])]
    return actions
  } else if (Array.isArray(actions)) {
    const permissionFormats = actions.map(action => `${modulePrefix}:${action}`)
    permission = [...new Set([...permission, ...permissionFormats])]

    return actions.reduce((perv, action: string) => {
      perv[action.toUpperCase()] = `${modulePrefix}: ${action}`
      return perv
    }, {})
  }
}

export const getDefinedPermissions = () => permission

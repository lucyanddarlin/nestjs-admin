export const PERMISSION_KEY = '__permission_key__'
export const PUBLIC_KEY = '__public_key__'

export const AuthStrategy = {
  JWT: 'jwt',
}

export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]

export const REDIS_IO_ADAPTER_KEY = 'm-shop-socket'
export const REDIS_CLIENT = Symbol('REDIS_CLIENT')
export const API_CACHE_PREFIX = 'api-cache'

export enum RedisKeys {
  ACCESS_IP = 'access_ip',
  CAPTCHA_IMG_PREFIX = 'captcha:img:',
  AUTH_TOKEN_PREFIX = 'auth:token:',
  AUTH_PERM_PREFIX = 'auth:permission:',
  AUTH_PASSWORD_V_PREFIX = 'auth:passwordVersion:',
  ONLINE_USER_PREFIX = 'online:user:',
  TOKEN_BLACKLIST_PREFIX = 'token:blacklist:',
}

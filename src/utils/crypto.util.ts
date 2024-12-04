import Crypto from 'crypto-js'

// const key = Crypto.enc.Utf8.parse('lucyabcdefe9bc')
// const iv = Crypto.enc.Utf8.parse('0123456789lucy')

export function md5(str: string) {
  return Crypto.MD5(str).toString()
}

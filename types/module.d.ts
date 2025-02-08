import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: IAuthUser
    accessToken: string
  }
}

declare module 'nextjs-cls' {
  interface ClsStore {
    operateId: number
  }
}

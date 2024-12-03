import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: any
    accessToken: string
  }

}

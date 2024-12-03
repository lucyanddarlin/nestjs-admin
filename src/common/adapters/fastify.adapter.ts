import FastifyCookie from '@fastify/cookie'
import FastifyMultipart from '@fastify/multipart'
import { FastifyAdapter } from '@nestjs/platform-fastify'

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
})

export { app as fastifyApp }

app.register(FastifyMultipart, {
  limits: {
    fields: 10,
    fileSize: 6 * 1024 * 1024,
    files: 5,
  },
})

app.register(FastifyCookie, {
  secret: 'cookie',
})

app.getInstance().addHook('onRequest', (request, reply, done) => {
  const { origin } = request.headers
  if (!origin) {
    request.headers.origin = request.headers.host
  }

  const { url } = request

  if (url.endsWith('.php')) {
    reply.raw.statusMessage = 'Eh. PHP is not support on this machine. Yep, I also think PHP is best programming language. But for me it is beyond my reach.'
    return reply.code(418).send()
  }

  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) {
    return reply.code(204).send()
  }

  done()
})

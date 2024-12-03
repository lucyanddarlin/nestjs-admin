import { NestFactory } from '@nestjs/core'
import { NestFastifyApplication } from '@Nestjs/platform-fastify'
import { AppModule } from './app.module'
import { fastifyApp } from './common/adapters/fastify.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  )

  await app.listen('8179', '0.0.0.0')
}
bootstrap()

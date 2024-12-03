import cluster from 'node:cluster'
import path from 'node:path'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { NestFactory } from '@nestjs/core'
import { NestFastifyApplication } from '@Nestjs/platform-fastify'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { fastifyApp } from './common/adapters/fastify.adapter'
import { APP_REG_TOKEN, ConfigKeyPaths } from './config'
import { isDev, isMainProcess } from './global/env'
import { setupSwagger } from './setup-swagger'
import { LoggerService } from './shared/logger/logger.service'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  )

  const configServer = app.get(ConfigService<ConfigKeyPaths>)
  const { port, globalPrefix } = configServer.get(APP_REG_TOKEN, { infer: true })

  // class-validator 的 DTO 类中注入 nest 容器的依赖(用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: false })

  app.enableCors({ origin: '*', credentials: true })
  app.setGlobalPrefix(globalPrefix)
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') })

  !isDev && app.enableShutdownHooks()

  setupSwagger(app, configServer)

  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService))
    const url = await app.getUrl()
    const { pid } = process
    const prefix = cluster.isPrimary ? 'P' : 'W'

    if (!isMainProcess)
      return

    const logger = new Logger('NestApplication')
    logger.log(`[${prefix + pid}] Server running on ${url}`)

    if (isDev) {
      logger.log(`[${prefix + pid}] OpenAPI: ${url}/api-docs`)
    }
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()

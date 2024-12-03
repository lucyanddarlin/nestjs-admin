import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { APP_REG_TOKEN, ConfigKeyPaths, IAppConfig, ISwaggerConfig, SWAGGER_REG_TOKEN } from './config'

export function setupSwagger(app: INestApplication, configServer: ConfigService<ConfigKeyPaths>) {
  const { name, port } = configServer.get<IAppConfig>(APP_REG_TOKEN)
  const { enable, path } = configServer.get<ISwaggerConfig>(SWAGGER_REG_TOKEN)

  if (!enable)
    return
  console.log('setupSwagger', enable, path)

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name}API Document`)
    .setVersion('1.0')

  documentBuilder.addSecurity('auth', {
    description: '输入令牌(Enter the token)',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'jwt',
  })

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [],
  })

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keep login
    },
  })
}

import config from '@/config'
import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AllExceptionFilter } from './common/filters/any-exception.filter'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { REQUEST_MAX_TIME_OUT } from './constant/request.constant'
import { HealthModule } from './modules/health/health.module'
import { DatabaseModule } from './shared/database/database.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    DatabaseModule,
    HealthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(REQUEST_MAX_TIME_OUT) },
  ],
})
export class AppModule {}

import { ConfigKeyPaths } from '@/config'
import { DB_REG_TOKEN, IDataBaseConfig } from '@/config/database.config'
import { env } from '@/global/env'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, LoggerOptions } from 'typeorm'
import { TypeOrmLogger } from './typeorm-logger'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configServer: ConfigService<ConfigKeyPaths>) {
        let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all'
        try {
          loggerOptions = JSON.parse(loggerOptions)
        }
        catch {
        }
        return {
          ...configServer.get<IDataBaseConfig>(DB_REG_TOKEN),
          autoLoadEntities: true,
          logging: loggerOptions,
          logger: new TypeOrmLogger(loggerOptions),
        }
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}

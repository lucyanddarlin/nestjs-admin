import { Logger } from '@nestjs/common'
import { Logger as ITypeOrmLogger, LoggerOptions, QueryRunner } from 'typeorm'

export class TypeOrmLogger implements ITypeOrmLogger {
  private logger = new Logger(TypeOrmLogger.name)

  constructor(private options: LoggerOptions) {}

  private isEnable(level: 'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration'): boolean {
    return (
      this.options === 'all'
      || this.options === true
      || (Array.isArray(this.options) && this.options.includes(level))
    )
  }

  private stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters)
    }
    catch {
      return parameters
    }
  }

  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    if (!this.isEnable('query'))
      return

    const sql = query + (parameters && parameters.length
      ? ` -- PARAMETERS : ${this.stringifyParams(parameters)}`
      : '')

    this.logger.log(`[QUERY]: ${sql}`)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ) {
    if (!this.isEnable('error'))
      return

    const sql = query + (parameters && parameters.length
      ? ` -- PARAMETERS : ${this.stringifyParams(parameters)}`
      : '')

    this.logger.error(`[FAILED QUERY]: ${sql}`, `[QUERY ERROR]: ${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length
      ? ` -- PARAMETERS : ${this.stringifyParams(parameters)}`
      : '')

    this.logger.warn(`[SLOW QUERY: ${time} ms]: ${sql}`)
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    if (!this.isEnable('schema'))
      return
    this.logger.log(message)
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    if (!this.isEnable('migration'))
      return
    this.logger.log(message)
  }

  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner) {
    if (!this.isEnable(level))
      return
    switch (level) {
      case 'log':
        this.logger.debug(message)
        break
      case 'info':
        this.logger.log(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      default:
        break
    }
  }
}
